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
using DotWeb.Controllers;

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

            if (q.type != null)
            {
                if (q.type == 1)
                {//pay_state
                    predicate = predicate.And(x => x.pay_state == q.type_val);
                }
                else if (q.type == 2)
                {//ship_state
                    predicate = predicate.And(x => x.ship_state == q.type_val);
                }
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

        #region 前台-已付款通知
        [Route("getRemitData")]
        [HttpGet]
        [AllowAnonymous]
        public async Task<IHttpActionResult> getRemitData(string no)
        {
            ResultInfo<Purchase> r = new ResultInfo<Purchase>();
            try
            {
                db0 = getDB0();
                if (!db0.Purchase.Any(x => x.purchase_no == no))
                {
                    r.result = false;
                    r.message = string.Format(Resources.Res.Log_Err_PurchaseExist, no);

                }
                else
                {
                    item = await db0.Purchase.FindAsync(no);

                    var data = new Purchase()
                    {
                        purchase_no = no,
                        remit_money = item.total
                    };

                    r.data = data;
                    r.result = true;
                }
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.ToString();
            }
            finally
            {
                db0.Dispose();
            }
            return Ok(r);
        }
        [Route("upRemitData")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> upRemitData([FromBody]Purchase md)
        {
            ResultInfo<Purchase> r = new ResultInfo<Purchase>();
            string no = md.purchase_no;
            try
            {
                db0 = getDB0();
                if (!db0.Purchase.Any(x => x.purchase_no == no))
                {//沒有這筆訂單編號
                    r.result = false;
                    r.message = string.Format(Resources.Res.Log_Err_PurchaseExist, no);
                }
                else if (db0.Purchase.Any(x => x.purchase_no == no & x.pay_type != (int)IPayType.Remit))
                {//此筆訂單非轉帳付款不須對帳確認
                    r.result = false;
                    r.message = string.Format(Resources.Res.Log_Err_PurchaseNoRemit, no);
                }
                else if (db0.Purchase.Any(x => x.purchase_no == no & (x.pay_state == (int)IPayState.paid || x.pay_state == (int)IPayState.cancel_order)))
                {//有此筆訂單,但 已確認付款 or 已取消訂單
                    r.result = false;
                    r.message = Resources.Res.Log_Err_PurchaseRepeat;
                }
                else
                {
                    item = await db0.Purchase.FindAsync(no);
                    if (item.total > md.remit_money)
                    {//匯款金額不正確
                        r.result = false;
                        r.message = Resources.Res.Log_Err_PurchaseMoney;
                    }
                    else
                    {
                        item.remit_no = md.remit_no;
                        item.remit_date = md.remit_date;
                        item.remit_money = md.remit_money;
                        item.remit_memo = md.remit_memo;
                        item.pay_state = (int)IPayState.paid_uncheck;

                        await db0.SaveChangesAsync();
                        r.result = true;

                        RemitEmail emd = new RemitEmail()
                        {
                            no = md.purchase_no,
                            day = md.remit_date
                        };

                        ResultInfo sendmail = (new EmailController()).sendRemitMail(emd);
                    }
                }
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.ToString();
            }
            finally
            {
                db0.Dispose();
            }
            return Ok(r);
        }
        #endregion
        #region 後台-已付款通知
        [Route("getRemitList")]
        [HttpGet]
        public async Task<IHttpActionResult> getRemitList([FromUri]RemitParam q)
        {
            #region 連接BusinessLogicLibary資料庫並取得資料

            db0 = getDB0();
            var predicate = PredicateBuilder.True<Purchase>();
            //只顯示轉帳付款,且付款狀態為 已付款待確認、已付款
            predicate = predicate.And(x => x.pay_type == (int)IPayType.Remit & x.pay_state >= (int)IPayState.paid_uncheck);

            if (q.keyword != null)
                predicate = predicate.And(x => x.purchase_no.Contains(q.keyword) ||
                                               x.receive_name.Contains(q.keyword));

            if (q.state != null)
                predicate = predicate.And(x => x.pay_state == q.state);

            if (q.pay_start != null & q.pay_end != null)
            {
                DateTime start = (DateTime)q.pay_start;
                DateTime end = ((DateTime)q.pay_end).AddDays(1);

                predicate = predicate.And(x => x.remit_date >= start & x.remit_date <= end);
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
                    x.remit_date,//轉帳日期
                    x.receive_name,
                    x.pay_type,//付款方式
                    x.pay_state,//付款狀態
                    x.ship_state,//出貨狀態
                    x.remit_no,//付款帳號後五碼
                    x.remit_money//轉帳金額
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
        [Route("upRemitState")]
        [HttpPost]
        public async Task<IHttpActionResult> upRemitState([FromBody]upRemitStateParma md)
        {
            ResultInfo<Purchase> r = new ResultInfo<Purchase>();
            try
            {
                using (var db0 = getDB0())
                {
                    foreach (var no in md.arr)
                    {
                        if (!db0.Purchase.Any(x => x.purchase_no == no))
                        {//沒有這筆訂單編號
                            r.result = false;
                            r.message = string.Format(Resources.Res.Log_Err_PurchaseExist, no);
                            return Ok(r);
                        }
                        else if (db0.Purchase.Any(x => x.purchase_no == no & x.pay_type != (int)IPayType.Remit))
                        {//此筆訂單非轉帳付款不須對帳確認
                            r.result = false;
                            r.message = string.Format(Resources.Res.Log_Err_PurchaseNoRemit, no);
                            return Ok(r);
                        }
                        else
                        {
                            item = await db0.Purchase.FindAsync(no);
                            if (md.state == (int)IPayState.paid_uncheck || md.state == (int)IPayState.paid)//狀態為paid、paid_uncheck才能更新
                                item.pay_state = md.state;
                        }
                    }
                    await db0.SaveChangesAsync();
                    r.result = true;
                }
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.ToString();
            }
            return Ok(r);
        }
        #endregion

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
            public int? type { get; set; }
            public int? type_val { get; set; }
        }
        public class RemitParam : QueryBase
        {
            public string keyword { set; get; }
            public DateTime? pay_start { get; set; }
            public DateTime? pay_end { get; set; }
            public int? state { get; set; }
        }
        public class delParam
        {
            public string id { get; set; }
        }

        public class upRemitStateParma
        {
            public int state { get; set; }
            public List<string> arr { get; set; }
        }
    }
}
