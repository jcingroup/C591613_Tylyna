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
    [RoutePrefix("api/FrontUser")]
    public class FrontUserController : ajaxAllBaseApi
    {//前台會員登入後相關api
        #region 查看訂單
        [Route("getReceiptList")]
        [HttpGet]
        public async Task<IHttpActionResult> getReceiptList([FromUri]ListParam q)
        {
            #region 連接BusinessLogicLibary資料庫並取得資料
            try
            {
                if (LoginUserFlag != "Y")
                {
                    return Ok(new
                    {
                        result = false,
                        message = Resources.Res.Log_Err_NoLogin
                    });
                }
                using (var db0 = getDB0())
                {
                    var predicate = PredicateBuilder.True<PurchaseDetail>();
                    //只顯示該會員資料
                    int c_id = int.Parse(this.UserId);
                    predicate = predicate.And(x => x.Purchase.customer_id == c_id);

                    if (q.state != null)
                    {
                        if (q.state == 1)
                        {//pay_state
                            predicate = predicate.And(x => x.Purchase.pay_state == q.state_val);
                        }
                        else if (q.state == 2)
                        {//ship_state
                            predicate = predicate.And(x => x.Purchase.ship_state == q.state_val);
                        }
                        else if (q.state == 3)
                        {//完成訂單 已付款、已出貨
                            predicate = predicate.And(x => x.Purchase.pay_state == (int)IPayState.paid &
                                                           x.Purchase.ship_state == (int)IShipState.shipped);
                        }
                    }

                    var result = db0.PurchaseDetail.AsExpandable().Where(predicate);
                    var resultItems = await result
                        .OrderBy(x => x.purchase_no)
                        .Select(x => new
                        {
                            x.purchase_no,
                            x.purchase_detail_id,
                            x.Purchase.order_date,
                            x.p_d_pack_name,
                            x.p_name,
                            x.qty,
                            x.Purchase.pay_type,
                            x.Purchase.pay_state,
                            x.Purchase.ship_state
                        })
                        .ToListAsync();

                    return Ok(new
                    {
                        result = true,
                        data = resultItems
                    });
                }

            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    result = false,
                    message = ex.ToString()
                });
            }
            #endregion
        }
        [Route("getReceiptItem")]
        [HttpGet]
        public async Task<IHttpActionResult> getReceiptItem(string no)
        {
            ResultInfo<Purchase> r = new ResultInfo<Purchase>();
            #region 連接BusinessLogicLibary資料庫並取得資料
            try
            {
                if (LoginUserFlag != "Y")
                {
                    r.result = false;
                    r.message = Resources.Res.Log_Err_NoLogin;
                    return Ok(r);
                }
                using (var db0 = getDB0())
                {
                    int c_id = int.Parse(this.UserId);
                    var item =await db0.Purchase.Where(x => x.customer_id == c_id & x.purchase_no == no).FirstOrDefaultAsync();

                    if (item != null)
                    {
                        item.Deatil = item.PurchaseDetail.ToList();
                        foreach (var i in item.Deatil)
                        {
                            var img = getImgFirst("ProductImg", i.product_id.ToString(), "600");
                            i.img_src = img != null ? img.src_path : null;
                        }
                        r.data = item;
                        r.result = true;
                    }
                    else
                    {
                        r.result = false;
                        r.message = string.Format(Resources.Res.Log_Err_PurchaseExist, no);
                    }
                }

            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.ToString();
            }
            return Ok(r);
            #endregion
        }
        #endregion

        #region 會員資料編輯
        /// <summary>
        /// 取得會員資料
        /// </summary>
        /// <returns></returns>
        [Route("GetItem")]
        [HttpGet]
        public async Task<IHttpActionResult> GetItem()
        {
            using (db0 = getDB0())
            {
                int c_id = int.Parse(this.UserId);
                Customer item = await db0.Customer.FindAsync(c_id);
                var r = new ResultInfo<Customer>() { data = item };
                r.result = true;
                return Ok(r);
            }
        }
        public async Task<IHttpActionResult> Put([FromBody]Customer md)
        {
            ResultInfo rAjaxResult = new ResultInfo();
            try
            {
                db0 = getDB0();
                int c_id = int.Parse(this.UserId);
                var item = await db0.Customer.FindAsync(c_id);

                md.i_UpdateDateTime = DateTime.Now;
                md.i_UpdateDeptID = departmentId;
                md.i_UpdateUserID = UserId;

                item.c_name = md.c_name;
                item.gender = md.gender;
                item.birthday = md.birthday;
                item.mobile = md.mobile;
                item.zip = md.zip;
                item.address = md.address;

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
        #endregion

        public class ListParam
        {
            public int? state { get; set; }
            public int? state_val { get; set; }
        }
    }
}
