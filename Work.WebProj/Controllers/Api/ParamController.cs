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
using ProcCore.Business.LogicConect;

namespace DotWeb.Api
{
    [RoutePrefix("api/Param")]
    public class ParamController : ajaxBaseApi
    {
        #region 購物金流維護
        public async Task<IHttpActionResult> Get()
        {
            Param md = new Param();
            var open = openLogic();
            using (db0 = getDB0())
            {
                md.Email = (string)open.getParmValue(ParmDefine.Email);

                md.AccountName = (string)open.getParmValue(ParmDefine.AccountName);
                md.BankName = (string)open.getParmValue(ParmDefine.BankName);
                md.BankCode = (string)open.getParmValue(ParmDefine.BankCode);
                md.AccountNumber = (string)open.getParmValue(ParmDefine.AccountNumber);

                md.ship = await db0.Shipment.ToListAsync();
                md.discount = await db0.Discount.ToListAsync();

                var r = new ResultInfo<Param>() { data = md };
                r.result = true;
                return Ok(r);
            }

        }

        public async Task<IHttpActionResult> Post([FromBody]Param md)
        {
            var r = new ResultInfo<Param>();

            try
            {
                #region param
                var open = openLogic();

                open.setParmValue(ParmDefine.Email, md.Email);

                open.setParmValue(ParmDefine.AccountName, md.AccountName);
                open.setParmValue(ParmDefine.BankName, md.BankName);
                open.setParmValue(ParmDefine.BankCode, md.BankCode);
                open.setParmValue(ParmDefine.AccountNumber, md.AccountNumber);
                #endregion

                #region working
                using (var tx = defAsyncScope())
                {
                    using (var db0 = getDB0())
                    {
                        #region 運費
                        var ships = md.ship;
                        //每種付款方式,若有設定固定運費(isfixed=true)只能設一筆
                        foreach (var ship in ships)
                        {
                            var item = db0.Shipment.Find(ship.shipment_id);

                            item.limit_money = ship.limit_money;
                            item.shipment_fee = ship.shipment_fee;
                            item.bank_charges = ship.bank_charges;
                            item.isfixed = ship.isfixed;
                        }
                        #endregion

                        #region 折扣
                        //目前db有的
                        var discounts = await db0.Discount.ToListAsync();
                        List<Discount> del_ditem = new List<Discount>();

                        foreach (var item in discounts)
                        {
                            var md_d = md.discount.FirstOrDefault(x => x.discount_id == item.discount_id);
                            if (md_d != null)
                            {
                                item.limit_money = md_d.limit_money;
                                item.per = md_d.per;
                                item.isuse = md_d.isuse;
                            }
                            else
                            {//原本再資料庫,但找不到的須刪除資料
                                del_ditem.Add(item);
                            }                         
                        }
                        //加入沒寫進資料庫的資料
                        var add_dlist = md.discount.Where(x => x.edit_type == IEditType.Insert);
                        foreach (var item in add_dlist) {
                            db0.Discount.Add(item);
                        }
                        db0.Discount.RemoveRange(del_ditem);
                        #endregion

                        await db0.SaveChangesAsync();
                        tx.Complete();
                    }
                }
                r.result = true;
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

        }
        #endregion

        #region 首頁影片維護
        [Route("GetYoutube")]
        [HttpGet]
        public IHttpActionResult GetYoutube()
        {
            ParamYoutube md = new ParamYoutube();
            var open = openLogic();
            using (db0 = getDB0())
            {
                md.YoutubeUrl = (string)open.getParmValue(ParmDefine.YoutubeUrl);

                var r = new ResultInfo<ParamYoutube>() { data = md };
                r.result = true;
                return Ok(r);
            }
        }

        [Route("PostYoutube")]
        [HttpPost]
        public IHttpActionResult PostYoutube([FromBody]ParamYoutube md)
        {
            var r = new ResultInfo<ParamYoutube>();

            try
            {
                #region param
                var open = openLogic();

                open.setParmValue(ParmDefine.YoutubeUrl, md.YoutubeUrl);

                #endregion

                r.result = true;
                return Ok(r);
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

        }
        #endregion

        public class Param
        {
            public string Email { get; set; }
            //匯款帳戶資料
            public string AccountName { get; set; }
            public string BankName { get; set; }
            public string BankCode { get; set; }
            public string AccountNumber { get; set; }
            public IEnumerable<Shipment> ship { get; set; }//運費
            public IEnumerable<Discount> discount { get; set; }//折扣
        }
        public class ParamYoutube
        {
            public string YoutubeUrl { get; set; }
        }
    }
}
