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
                using (var db0 = getDB0())
                {
                    var ships = md.ship;

                    foreach (var ship in ships)
                    {
                        var item = db0.Shipment.Find(ship.shipment_id);

                        item.limit_money = ship.limit_money;
                        item.shipment_fee = ship.shipment_fee;
                        item.bank_charges = ship.bank_charges;
                    }

                    await db0.SaveChangesAsync();
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

        public class Param
        {
            public string Email { get; set; }
            //匯款帳戶資料
            public string AccountName { get; set; }
            public string BankName { get; set; }
            public string BankCode { get; set; }
            public string AccountNumber { get; set; }
            public IEnumerable<Shipment> ship { get; set; }//運費
        }
    }
}
