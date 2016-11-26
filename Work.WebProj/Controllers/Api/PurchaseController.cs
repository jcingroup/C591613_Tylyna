using Microsoft.AspNet.Identity.EntityFramework;
using ProcCore.Business;
using ProcCore.Business.DB0;
using ProcCore.HandleResult;
using ProcCore.WebCore;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using LinqKit;
using System.Data.Entity.Validation;
using System.Data.Entity.Infrastructure;
using System.Linq.Dynamic;

namespace DotWeb.Api
{
    [RoutePrefix("api/Purchase")]
    public class PurchaseController : ajaxApi<Purchase>
    {
        public async Task<IHttpActionResult> Get(string no)
        {
            using (db0 = getDB0())
            {
                Purchase item = await db0.Purchase.FindAsync(no);
                item.customer_name = item.Customer.c_name;
                item.Deatil = item.PurchaseDetail.ToList();
                item.cancel_order = (item.pay_state == (int)IPayState.cancel_order) ? true : false;
                var r = new ResultInfo<Purchase>() { data = item };
                r.result = true;
                return Ok(r);
            }
        }
        public async Task<IHttpActionResult> Get([FromUri]queryParam q)
        {
            #region 連接BusinessLogicLibary資料庫並取得資料

            db0 = getDB0();
            var predicate = PredicateBuilder.True<Purchase>();

            if (q.keyword != null)
                predicate = predicate.And(x => x.purchase_no.Contains(q.keyword) ||
                                               x.receive_name.Contains(q.keyword));

            if (q.order_date != null)
            {
                DateTime o_date = (DateTime)q.order_date;
                predicate = predicate.And(x => x.order_date >= o_date & o_date <= x.order_date);
            }

            if (q.pay_date != null)
            {
                predicate = predicate.And(x => x.remit_date >= q.pay_date & q.pay_date <= x.remit_date);
            }

            int page = (q.page == null ? 1 : (int)q.page);
            var result = db0.Purchase.AsExpandable().Where(predicate);
            var resultCount = await result.CountAsync();

            IQueryable<Purchase> resultOrderItems = null;

            if (q.field != null)
            {
                if (q.sort == "asc")
                    resultOrderItems = result.OrderBy(q.field);

                if (q.sort == "desc")
                    resultOrderItems = result.OrderBy(q.field + " descending");
            }
            else
            {
                resultOrderItems = result.OrderBy(x => x.purchase_no);
            }

            int startRecord = PageCount.PageInfo(page, defPageSize, resultCount);
            var resultItems = await
                resultOrderItems
                .Skip(startRecord)
                .Take(defPageSize)
                .Select(x => new
                {
                    x.purchase_no,
                    x.customer_id,
                    x.order_date,
                    x.remit_date,
                    x.receive_name,
                    x.pay_type,//付款方式
                    x.pay_state,//付款狀態
                    x.ship_state,//出貨狀態
                    Deatil = x.PurchaseDetail.ToList()
                })
                .ToListAsync();

            db0.Dispose();

            return Ok(new
            {
                rows = resultItems,
                total = PageCount.TotalPage,
                page = PageCount.Page,
                records = PageCount.RecordCount,
                startcount = PageCount.StartCount,
                endcount = PageCount.EndCount,
                field = q.field,
                sort = q.sort
            });

            #endregion
        }
        public async Task<IHttpActionResult> Put([FromBody]putBodyParam param)
        {
            ResultInfo rAjaxResult = new ResultInfo();
            try
            {
                db0 = getDB0();
                item = await db0.Purchase.FindAsync(param.id);
                var md = param.md;

                #region 出貨狀態
                if (md.ship_state == (int)IShipState.shipped)
                {
                    item.ship_state = (int)IShipState.shipped;
                    item.ship_date = DateTime.Now;
                }
                else if (md.ship_state == (int)IShipState.unshipped)
                {
                    item.ship_state = (int)IShipState.unshipped;
                    item.ship_date = null;
                }

                if (md.cancel_order == true)
                {
                    item.pay_state = (int)IPayState.cancel_order;
                    item.ship_state = (int)IShipState.cancel_order;
                    item.cancel_reason = md.cancel_reason;
                }
                #endregion

                //db0.Entry(md).State = EntityState.Modified;

                await db0.SaveChangesAsync();
                rAjaxResult.result = true;
            }
            catch (Exception ex)
            {
                rAjaxResult.result = false;
                rAjaxResult.message = ex.ToString();
            }
            finally
            {
                db0.Dispose();
            }
            return Ok(rAjaxResult);
        }
        public async Task<IHttpActionResult> Post([FromBody]Purchase md)
        {
            md.purchase_no = "P" + DateTime.Now.ToString("yyyyMMdd") + GetNewId(CodeTable.Purchase);//訂單編號

            md.order_date = DateTime.Now;//訂購日期
            md.pay_state = (int)IPayState.unpaid;//付款狀態
            md.ship_state = (int)IShipState.unshipped;//出貨狀態
            r = new ResultInfo<Purchase>();
            if (!ModelState.IsValid)
            {
                r.message = ModelStateErrorPack();
                r.result = false;
                return Ok(r);
            }

            try
            {
                #region working
                db0 = getDB0();

                db0.Purchase.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.no = md.purchase_no;
                return Ok(r);
                #endregion
            }
            catch (DbEntityValidationException ex) //欄位驗證錯誤
            {
                r.message = getDbEntityValidationException(ex);
                r.result = false;
                return Ok(r);
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message + "\r\n" + getErrorMessage(ex);
                return Ok(r);
            }
            finally
            {
                db0.Dispose();
            }
        }
        public async Task<IHttpActionResult> Delete([FromBody]delParam param)
        {
            try
            {
                db0 = getDB0();
                r = new ResultInfo<Purchase>();

                item = await db0.Purchase.FindAsync(param.id);
                if (item != null)
                {
                    db0.Purchase.Remove(item);
                    await db0.SaveChangesAsync();
                    r.result = true;
                    return Ok(r);
                }
                else
                {
                    r.result = false;
                    r.message = Resources.Res.Log_Err_Delete_NotFind;
                    return Ok(r);
                }

            }
            catch (DbUpdateException ex)
            {
                r.result = false;
                if (ex.InnerException != null)
                {
                    r.message = Resources.Res.Log_Err_Delete_DetailExist + "\r\n" + getErrorMessage(ex);
                }
                else
                {
                    r.message = ex.Message;
                }
                return Ok(r);
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
                return Ok(r);
            }
            finally
            {
                db0.Dispose();
            }
        }

        [Route("updateShipState")]
        [HttpPost]
        public async Task<IHttpActionResult> updateShipState([FromBody]ShipStateParma param)
        {
            ResultInfo rAjaxResult = new ResultInfo();
            try
            {
                db0 = getDB0();
                item = await db0.Purchase.FindAsync(param.id);

                if (param.state == (int)IShipState.shipped)
                {
                    item.ship_state = (int)IShipState.shipped;
                    item.ship_date = DateTime.Now;
                }
                else if (param.state == (int)IShipState.unshipped)
                {
                    item.ship_state = (int)IShipState.unshipped;
                    item.ship_date = null;
                }

                await db0.SaveChangesAsync();
                rAjaxResult.result = true;
            }
            catch (Exception ex)
            {
                rAjaxResult.result = false;
                rAjaxResult.message = ex.ToString();
            }
            finally
            {
                db0.Dispose();
            }
            return Ok(rAjaxResult);
        }

        public class putBodyParam
        {
            public string id { get; set; }
            public Purchase md { get; set; }
        }
        public class queryParam : QueryBase
        {
            public string keyword { set; get; }
            public DateTime? order_date { get; set; }
            public DateTime? pay_date { get; set; }
        }
        public class delParam
        {
            public string id { get; set; }
        }

        public class ShipStateParma
        {
            public string id { get; set; }
            public int state { get; set; }
        }
    }
}
