﻿using Microsoft.AspNet.Identity.EntityFramework;
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
    [RoutePrefix("api/Editor_L2")]
    public class Editor_L2Controller : ajaxApi<Editor_L2>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                Editor_L2 item = await db0.Editor_L2.FindAsync(id);
                var r = new ResultInfo<Editor_L2>() { data = item };
                r.result = true;
                return Ok(r);
            }
        }
        public async Task<IHttpActionResult> Get([FromUri]queryParam q)
        {
            #region 連接BusinessLogicLibary資料庫並取得資料

            db0 = getDB0();

            var resultItems = await db0.Editor_L2
                .Where(x => x.editor_l1_id == q.main_id)
                .Select(x => new m_Editor_L2
                {
                    editor_l1_id = x.editor_l1_id,
                    editor_l2_id = x.editor_l2_id,
                    l2_name = x.l2_name,
                    l2_content = x.l2_content,
                    sort = x.sort,
                    edit_type = IEditType.Update,
                    view_mode = InputViewMode.view
                })
                .ToListAsync();

            db0.Dispose();

            return Ok(resultItems);

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
        public async Task<IHttpActionResult> Post([FromBody]Editor_L2 md)
        {
            md.editor_l2_id = GetNewId(CodeTable.Editor_L2);

            r = new ResultInfo<Editor_L2>();
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

                db0.Editor_L2.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.editor_l2_id;
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
                r = new ResultInfo<Editor_L2>();

                item = await db0.Editor_L2.FindAsync(param.id);

                if (item != null)
                {
                    db0.Editor_L2.Remove(item);
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
            public Editor_L2 md { get; set; }
        }
        public class queryParam : QueryBase
        {
            public int main_id { set; get; }
        }
        public class delParam
        {
            public int id { get; set; }
        }
    }
}
