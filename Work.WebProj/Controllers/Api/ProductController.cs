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
    [RoutePrefix("api/Product")]
    public class ProductController : ajaxApi<Product>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                Product item = await db0.Product.FindAsync(id);
                item.Deatil = item.ProductDetail
                    .Select(x => new m_ProductDetail()
                    {
                        product_id = x.product_id,
                        product_detail_id = x.product_detail_id,
                        sn = x.sn,//料號
                        pack_name = x.pack_name,//包裝
                        weight = x.weight,//重量
                        price = x.price,//單價
                        stock_state = x.stock_state,//狀態 上架/缺貨中
                        edit_type = IEditType.update,
                        view_mode = InputViewMode.view
                    })
                    .ToList();
                var r = new ResultInfo<Product>() { data = item };
                r.result = true;
                return Ok(r);
            }
        }
        public async Task<IHttpActionResult> Get([FromUri]queryParam q)
        {
            #region 連接BusinessLogicLibary資料庫並取得資料

            db0 = getDB0();
            var predicate = PredicateBuilder.True<Product>();

            if (q.name != null)
                predicate = predicate.And(x => x.product_name.Contains(q.name));

            if (q.kind != null)
                predicate = predicate.And(x => x.product_kind_id == q.kind);

            if (q.i_Hide != null)
                predicate = predicate.And(x => x.i_Hide == q.i_Hide);

            int page = (q.page == null ? 1 : (int)q.page);
            var result = db0.Product.AsExpandable().Where(predicate);
            var resultCount = await result.CountAsync();

            IQueryable<Product> resultOrderItems = null;

            if (q.field != null)
            {
                if (q.sort == "asc")
                    resultOrderItems = result.OrderBy(q.field);

                if (q.sort == "desc")
                    resultOrderItems = result.OrderBy(q.field + " descending");
            }
            else
            {
                resultOrderItems = result.OrderBy(x => x.product_id);
            }

            int startRecord = PageCount.PageInfo(page, defPageSize, resultCount);
            var resultItems = await
                resultOrderItems
                .Skip(startRecord)
                .Take(defPageSize)
                .Select(x => new
                {
                    x.product_id,
                    x.product_kind_id,
                    kind_name = x.ProductKind.kind_name,
                    Pack = x.ProductDetail.Select(y => y.pack_name).ToList(),
                    x.product_name,
                    x.sort,
                    x.i_Hide
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
        public async Task<IHttpActionResult> Post([FromBody]Product md)
        {
            md.product_id = GetNewId(CodeTable.Product);

            md.i_InsertDateTime = DateTime.Now;
            md.i_InsertDeptID = departmentId;
            md.i_InsertUserID = UserId;
            md.i_UpdateDateTime = DateTime.Now;
            md.i_UpdateDeptID = departmentId;
            md.i_UpdateUserID = UserId;
            md.i_Lang = "zh-TW";
            r = new ResultInfo<Product>();
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

                db0.Product.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.product_id;
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
                r = new ResultInfo<Product>();

                item = await db0.Product.FindAsync(param.id);
                if (item != null)
                {
                    db0.Product.Remove(item);
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

        [Route("GetInitData")]
        public async Task<IHttpActionResult> GetInitData()
        {
            #region 連接BusinessLogicLibary資料庫並取得資料
            using (db0 = getDB0())
            {
                var kind_list = db0.ProductKind
                    .Where(x => !x.i_Hide)
                    .OrderByDescending(x => x.sort)
                    .Select(x => new
                    {
                        val = x.product_kind_id,
                        Lname = x.kind_name
                    });

                return Ok(new
                {
                    kind_list = await kind_list.ToListAsync(),
                });
            }

            #endregion
        }

        public class putBodyParam
        {
            public int id { get; set; }
            public Product md { get; set; }
        }
        public class queryParam : QueryBase
        {
            public string name { set; get; }
            public int? kind { get; set; }
            public bool? i_Hide { get; set; }
        }
        public class delParam
        {
            public int id { get; set; }
        }
    }
}
