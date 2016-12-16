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
    [RoutePrefix("api/Editor_L1")]
    public class Editor_L1Controller : ajaxApi<Editor_L1>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                Editor_L1 item = await db0.Editor_L1.FindAsync(id);
                item.Deatil = item.Editor_L2
                                  .Select(x => new m_Editor_L2()
                                  {
                                      editor_l1_id = x.editor_l1_id,
                                      editor_l2_id = x.editor_l2_id,
                                      l2_name = x.l2_name,
                                      l2_content = x.l2_content,
                                      sort = x.sort,
                                      edit_type = IEditType.Update,
                                      view_mode = InputViewMode.view
                                  })
                                .ToList();
                var r = new ResultInfo<Editor_L1>() { data = item };
                r.result = true;
                return Ok(r);
            }
        }
        public async Task<IHttpActionResult> Get([FromUri]queryParam q)
        {
            #region 連接BusinessLogicLibary資料庫並取得資料

            db0 = getDB0();
            var predicate = PredicateBuilder.True<Editor_L1>();

            if (q.name != null)
                predicate = predicate.And(x => x.name.Contains(q.name));


            int page = (q.page == null ? 1 : (int)q.page);
            var result = db0.Editor_L1.AsExpandable().Where(predicate);
            var resultCount = await result.CountAsync();

            IQueryable<Editor_L1> resultOrderItems = null;

            if (q.field != null)
            {
                if (q.sort == "asc")
                    resultOrderItems = result.OrderBy(q.field);

                if (q.sort == "desc")
                    resultOrderItems = result.OrderBy(q.field + " descending");
            }
            else
            {
                resultOrderItems = result.OrderBy(x => x.editor_l1_id);
            }

            int startRecord = PageCount.PageInfo(page, defPageSize, resultCount);
            var resultItems = await
                resultOrderItems
                .Skip(startRecord)
                .Take(defPageSize)
                .Select(x => new
                {
                    x.editor_l1_id,
                    x.name,
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
                item = await db0.Editor_L1.FindAsync(param.id);
                var md = param.md;

                #region detail update
                var details = item.Editor_L2;

                foreach (var detail in details)
                {
                    var md_detail = md.Deatil.FirstOrDefault(x => x.editor_l2_id == detail.editor_l2_id);
                    if (detail.sort != md_detail.sort ||
                        detail.l2_name != md_detail.l2_name ||
                        detail.l2_content != md_detail.l2_content)
                    {
                        detail.i_UpdateUserID = UserId;
                        detail.i_UpdateDateTime = DateTime.Now;
                        detail.i_UpdateDeptID = departmentId;
                    }
                    detail.sort = md_detail.sort;
                    detail.l2_name = md_detail.l2_name;
                    detail.l2_content = md_detail.l2_content != null ? RemoveScriptTag(md_detail.l2_content) : null;
                }
                #endregion
                #region add
                var add_detail = md.Deatil.Where(x => x.edit_type == IEditType.Insert);
                foreach (var detail in add_detail)
                {
                    var add_item = new Editor_L2()
                    {
                        editor_l1_id = md.editor_l1_id,
                        editor_l2_id = GetNewId(CodeTable.Editor_L2),
                        l2_name = detail.l2_name,
                        l2_content = detail.l2_content != null ? RemoveScriptTag(detail.l2_content) : null,
                        sort = detail.sort,
                        i_Hide = false,
                        i_InsertUserID = UserId,
                        i_InsertDateTime = DateTime.Now,
                        i_InsertDeptID = departmentId,
                        i_UpdateUserID = UserId,
                        i_UpdateDateTime = DateTime.Now,
                        i_UpdateDeptID = departmentId,
                        i_Lang = "zh-TW"
                    };
                    details.Add(add_item);
                }

                #endregion

                item.name = md.name;
                item.sort = md.sort;

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
        public async Task<IHttpActionResult> Post([FromBody]Editor_L1 md)
        {
            md.editor_l1_id = GetNewId(CodeTable.Editor_L1);

            r = new ResultInfo<Editor_L1>();
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

                db0.Editor_L1.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.editor_l1_id;
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
                r = new ResultInfo<Editor_L1>();

                item = await db0.Editor_L1.FindAsync(param.id);

                if (item != null)
                {
                    db0.Editor_L1.Remove(item);
                    db0.Editor_L2.RemoveRange(item.Editor_L2);
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
            public Editor_L1 md { get; set; }
        }
        public class queryParam : QueryBase
        {
            public string name { set; get; }
            public int l1_id { get; set; }
        }
        public class delParam
        {
            public int id { get; set; }
        }
    }
}
