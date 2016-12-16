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
    [RoutePrefix("api/News")]
    public class NewsController : ajaxApi<News>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                News item = await db0.News.FindAsync(id);
                var r = new ResultInfo<News>() { data = item };
                r.result = true;
                return Ok(r);
            }
        }
        public async Task<IHttpActionResult> Get([FromUri]queryParam q)
        {
            #region 連接BusinessLogicLibary資料庫並取得資料

            db0 = getDB0();
            var predicate = PredicateBuilder.True<News>();

            if (q.name != null)
                predicate = predicate.And(x => x.news_title.Contains(q.name));

            if (q.day != null)
            {
                DateTime start = (DateTime)q.day;
                DateTime end = ((DateTime)q.day).AddDays(1);

                predicate = predicate.And(x => x.day >= start & x.day < end);
            }


            if (q.i_Hide != null)
                predicate = predicate.And(x => x.i_Hide == q.i_Hide);

            int page = (q.page == null ? 1 : (int)q.page);
            var result = db0.News.AsExpandable().Where(predicate);
            var resultCount = await result.CountAsync();

            IQueryable<News> resultOrderItems = null;

            if (q.field != null)
            {
                if (q.sort == "asc")
                    resultOrderItems = result.OrderBy(q.field);

                if (q.sort == "desc")
                    resultOrderItems = result.OrderBy(q.field + " descending");
            }
            else
            {
                resultOrderItems = result.OrderByDescending(x => x.sort);
            }

            int startRecord = PageCount.PageInfo(page, defPageSize, resultCount);
            var resultItems = await
                resultOrderItems
                .Skip(startRecord)
                .Take(defPageSize)
                .Select(x => new
                {
                    x.news_id,
                    x.news_title,
                    x.day,
                    x.i_Hide,//狀態
                    x.no_index,//首頁顯示
                    x.sort
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
                //item = await db0.ProductKind.FindAsync(param.id);
                var md = param.md;

                md.i_UpdateDateTime = DateTime.Now;
                md.i_UpdateDeptID = departmentId;
                md.i_UpdateUserID = UserId;

                db0.Entry(md).State = EntityState.Modified;

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
        public async Task<IHttpActionResult> Post([FromBody]News md)
        {
            md.news_id = GetNewId(CodeTable.News);

            md.i_InsertDateTime = DateTime.Now;
            md.i_InsertDeptID = departmentId;
            md.i_InsertUserID = UserId;
            md.i_UpdateDateTime = DateTime.Now;
            md.i_UpdateDeptID = departmentId;
            md.i_UpdateUserID = UserId;
            md.i_Lang = "zh-TW";
            r = new ResultInfo<News>();
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

                db0.News.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.news_id;
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
                r = new ResultInfo<News>();

                item = await db0.News.FindAsync(param.id);

                if (item != null)
                {
                    db0.News.Remove(item);
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

        public class putBodyParam
        {
            public int id { get; set; }
            public News md { get; set; }
        }
        public class queryParam : QueryBase
        {
            public string name { set; get; }
            public DateTime? day { get; set; }
            public bool? i_Hide { get; set; }
        }
        public class delParam
        {
            public int id { get; set; }
        }
    }
}
