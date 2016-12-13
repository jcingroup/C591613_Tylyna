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
using ProcCore;
using System.Web;

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
                    var item = await db0.Purchase.Where(x => x.customer_id == c_id & x.purchase_no == no).FirstOrDefaultAsync();

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
        [Route("chgEmail")]
        [HttpPost]
        public async Task<IHttpActionResult> chgEmail([FromBody]string email)
        {
            ResultInfo r = new ResultInfo();
            try
            {
                db0 = getDB0();
                int c_id = int.Parse(this.UserId);
                var item = await db0.Customer.FindAsync(c_id);

                if (db0.Customer.Any(x => x.email == email & x.customer_id != c_id))
                {
                    r.result = false;
                    r.message = Resources.Res.Log_Err_EmailExist;
                    return Ok(r);
                }

                item.email = email;

                await db0.SaveChangesAsync();
                r.result = true;
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

        [Route("chgPW")]
        [HttpPost]
        public async Task<IHttpActionResult> chgPW([FromBody]ManageUserViewModel md)
        {
            ResultInfo r = new ResultInfo();
            try
            {
                if (ModelState.IsValid)
                {
                    if (md.NewPassword == md.OldPassword)
                    {//新密碼和舊密碼不可相同
                        r.result = false;
                        r.message = Resources.Res.Log_Err_NewPasswordSame;
                        return Ok(r);
                    }
                    using (var db0 = getDB0())
                    {
                        int c_id = int.Parse(this.UserId);
                        var item = await db0.Customer.FindAsync(c_id);

                        string old = HttpUtility.UrlEncode(EncryptString.desEncryptBase64(md.OldPassword));
                        if (item.c_pw != old)
                        {//舊密碼輸入錯誤
                            r.result = false;
                            r.message = Resources.Res.Log_Err_Password;
                            return Ok(r);
                        }
                        else
                        {
                            item.c_pw = HttpUtility.UrlEncode(EncryptString.desEncryptBase64(md.NewPassword));
                            await db0.SaveChangesAsync();
                            r.result = true;
                            r.message = Resources.Res.Info_ChangePassword_Success;
                        }
                    }               
                }
                else
                {
                    List<string> errMessage = new List<string>();
                    foreach (System.Web.Http.ModelBinding.ModelState modelState in ModelState.Values)
                        foreach (System.Web.Http.ModelBinding.ModelError error in modelState.Errors)
                            errMessage.Add(error.ErrorMessage);

                    r.message = String.Join(":", errMessage);
                    r.result = false;
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

        #region 忘記密碼
        [Route("forgotPWSendMail")]
        [HttpGet]
        [AllowAnonymous]
        public IHttpActionResult forgotPWSendMail([FromUri]string email)
        {
            ResultInfo r = new ResultInfo();
            try
            {
                db0 = getDB0();

                if (!db0.Customer.Any(x => x.email == email))
                {
                    r.result = false;
                    r.message = Resources.Res.Log_Err_EmailNoExist;
                    return Ok(r);
                }
                //產生驗證
                ResultInfo addcode = addCheckCode(email);
                if (!addcode.result)
                {
                    r.result = false;
                    r.message = addcode.message;
                    return Ok(r);
                }
                ForgotPwEmail emd = new ForgotPwEmail()
                {
                    mail = email,
                    code = HttpUtility.UrlEncode(EncryptString.desEncryptBase64(addcode.no))//要加密
                };
                ResultInfo sendmail = (new EmailController()).sendForgotPWMail(emd);
                r = sendmail;
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

        [Route("chgPWbyFG")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<IHttpActionResult> chgPWbyFG([FromBody]forgotChgPW md)
        {
            ResultInfo r = new ResultInfo();
            try
            {
                db0 = getDB0();
                var item = await db0.Customer.Where(x => x.email == md.Email).FirstOrDefaultAsync();

                if (md.NewPassword != md.ConfirmPassword)
                {//確認密碼和新密碼不一致
                    r.result = false;
                    r.message = Resources.Res.Log_Err_NewPasswordNotSure;
                    return Ok(r);
                }
                if (item == null)
                {//此用戶不存在
                    r.result = false;
                    r.message = Resources.Res.Log_Err_NoThisUser;
                    return Ok(r);
                }
                if (!checkCode(md.code))
                {//無效代碼
                    r.result = false;
                    r.message = Resources.Res.Login_Err_NotValidCode;
                    return Ok(r);
                }

                item.c_pw = HttpUtility.UrlEncode(EncryptString.desEncryptBase64(md.NewPassword));

                await db0.SaveChangesAsync();
                r.result = true;
                r.message = Resources.Res.Info_ChangePassword_Success;
                upCheckCode(md.code);
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

        public class ListParam
        {
            public int? state { get; set; }
            public int? state_val { get; set; }
        }
        public class forgotChgPW
        {
            public string code { get; set; }
            public string Email { get; set; }
            public string NewPassword { get; set; }
            public string ConfirmPassword { get; set; }
        }
    }
}
