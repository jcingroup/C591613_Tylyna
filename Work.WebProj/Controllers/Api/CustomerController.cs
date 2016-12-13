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
    [RoutePrefix("api/Customer")]
    public class CustomerController : ajaxApi<Customer>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                Customer item = await db0.Customer.FindAsync(id);
                var r = new ResultInfo<Customer>() { data = item };
                r.result = true;
                return Ok(r);
            }
        }
        public async Task<IHttpActionResult> Get([FromUri]queryParam q)
        {
            #region 連接BusinessLogicLibary資料庫並取得資料

            db0 = getDB0();
            var predicate = PredicateBuilder.True<Customer>();

            if (q.name != null)
                predicate = predicate.And(x => x.c_name.Contains(q.name) || x.email.Contains(q.name)
                                               || x.tel.Contains(q.name) || x.mobile.Contains(q.name)
                                               || x.zip.Contains(q.name) || x.address.Contains(q.name));

            int page = (q.page == null ? 1 : (int)q.page);
            var result = db0.Customer.AsExpandable().Where(predicate);
            var resultCount = await result.CountAsync();

            IQueryable<Customer> resultOrderItems = null;

            if (q.field != null)
            {
                if (q.sort == "asc")
                    resultOrderItems = result.OrderBy(q.field);

                if (q.sort == "desc")
                    resultOrderItems = result.OrderBy(q.field + " descending");
            }
            else
            {
                resultOrderItems = result.OrderBy(x => x.customer_id);
            }

            int startRecord = PageCount.PageInfo(page, defPageSize, resultCount);
            var resultItems = await
                resultOrderItems
                .Skip(startRecord)
                .Take(defPageSize)
                .Select(x => new
                {
                    x.customer_id,
                    x.c_name,
                    x.email,
                    x.tel,
                    x.mobile,
                    x.zip,
                    x.address
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
                item = await db0.Customer.FindAsync(param.id);
                var md = param.md;

                item.i_UpdateDateTime = DateTime.Now;
                item.i_UpdateDeptID = departmentId;
                item.i_UpdateUserID = UserId;

                item.c_name = md.c_name;
                item.gender = md.gender;
                item.tel = md.tel;
                item.mobile = md.mobile;
                item.zip = md.zip;
                item.address = md.address;
                item.birthday = md.birthday;

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
        public async Task<IHttpActionResult> Post([FromBody]Customer md)
        {
            md.customer_id = GetNewId(CodeTable.Customer);

            md.i_InsertDateTime = DateTime.Now;
            md.i_InsertDeptID = departmentId;
            md.i_InsertUserID = UserId;
            md.i_UpdateDateTime = DateTime.Now;
            md.i_UpdateDeptID = departmentId;
            md.i_UpdateUserID = UserId;
            md.i_Lang = "zh-TW";
            r = new ResultInfo<Customer>();
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

                db0.Customer.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.customer_id;
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

        public class putBodyParam
        {
            public int id { get; set; }
            public Customer md { get; set; }
        }
        public class queryParam : QueryBase
        {
            public string name { set; get; }
        }
        public class delParam
        {
            public int id { get; set; }
        }
    }
}
