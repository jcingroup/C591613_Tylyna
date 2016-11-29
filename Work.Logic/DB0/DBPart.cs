using System;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Core;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using System.Reflection;

namespace ProcCore.Business.DB0
{

    public enum IEditType
    {
        none = 0,
        insert = 1,
        update = 2
    }
    public enum InputViewMode
    {
        view = 0,
        edit = 1
    }
    public enum IStockState
    {//產品狀況
        on_store_shelves = 1,//上架中
        replenishment = -1//補貨中
    }
    public enum IPayType
    {//付款方式
        Remit = 1,//轉帳付款
        CashOnDelivery = 2//貨到付款
    }
    public enum IPayState
    {//付款狀態
        cancel_order = -1,//取消訂單
        unpaid = 0,//待付款
        paid_uncheck = 1,//已付款,待確認
        paid = 2//已付款
    }
    public enum IShipState
    {//出貨狀態
        cancel_order = -1,//取消訂單
        unshipped = 0,//待出貨
        shipped = 1//已出貨
    }
    #region set CodeSheet

    public static class CodeSheet
    {
        public static List<i_Code> pack_type = new List<i_Code>()
        {
            new i_Code{ Code = 1, Value = "袋裝咖啡豆", LangCode = "wait" },
            new i_Code{ Code = 2, Value = "5入濾掛式包", LangCode = "progress" },
            new i_Code{ Code = 3, Value = "10入濾掛式包", LangCode = "finish" }
        };
        public static List<i_Code> IPayTypeData = new List<i_Code>()
        {
            new i_Code{ Code = 1, Value = "轉帳匯款", LangCode = "wait" },
            new i_Code{ Code = 2, Value = "貨到付款", LangCode = "progress" }
        };
        public static List<i_Code> IPayStateData = new List<i_Code>()
        {
            new i_Code{ Code = -1, Value = "取消訂單", LangCode = "wait" },
            new i_Code{ Code = 0, Value = "待付款", LangCode = "progress" },
            new i_Code{ Code = 1, Value = "已付款待確認", LangCode = "progress" },
            new i_Code{ Code = 2, Value = "已付款", LangCode = "progress" }
        };
        public static List<i_Code> IShipStateData = new List<i_Code>()
        {
            new i_Code{ Code = -1, Value = "取消訂單", LangCode = "wait" },
            new i_Code{ Code = 0, Value = "待出貨", LangCode = "progress" },
            new i_Code{ Code = 1, Value = "已出貨", LangCode = "progress" }
        };

        public static string GetStateVal(int code, i_CodeName propName, List<i_Code> data)
        {
            string Val = string.Empty;
            string name = Enum.GetName(typeof(i_CodeName), propName);
            foreach (var item in data)
            {
                if (item.Code == code)
                    Val = GetPropValue(item, name).ToString();
            }
            return Val;
        }
        public static Object GetPropValue(this Object obj, String name)
        {
            foreach (String part in name.Split('.'))
            {
                if (obj == null) { return null; }

                Type type = obj.GetType();
                PropertyInfo info = type.GetProperty(part);
                if (info == null) { return null; }

                obj = info.GetValue(obj, null);
            }
            return obj;
        }
    }
    public enum i_CodeName
    {
        Code,
        LangCode,
        Value
    }
    public class i_Code
    {
        public int? Code { get; set; }
        public string LangCode { get; set; }
        public string Value { get; set; }
    }
    #endregion
    public class option
    {
        public int val { get; set; }
        public string Lname { get; set; }
    }
    public partial class Menu
    {
        public IList<MenuRoleArray> role_array { get; set; }
    }
    public class MenuRoleArray
    {
        public string role_id { get; set; }
        public bool role_use { get; set; }
        public string role_name { get; set; }
    }
    public class m_ProductDetail
    {
        public int product_detail_id { get; set; }
        public int product_id { get; set; }
        public string sn { get; set; }
        public int pack_type { get; set; }
        public double weight { get; set; }
        public double price { get; set; }
        public int stock_state { get; set; }

        public int qty { get; set; }
        public IEditType edit_type { get; set; }
        public InputViewMode view_mode { get; set; }
    }
    public partial class C591613_TylynaEntities : DbContext
    {
        public C591613_TylynaEntities(string connectionstring)
            : base(connectionstring)
        {
        }

        public override Task<int> SaveChangesAsync()
        {
            return base.SaveChangesAsync();
        }
        public override int SaveChanges()
        {
            try
            {
                return base.SaveChanges();
            }
            catch (DbEntityValidationException ex)
            {
                Log.Write(ex.Message, ex.StackTrace);
                foreach (var err_Items in ex.EntityValidationErrors)
                {
                    foreach (var err_Item in err_Items.ValidationErrors)
                    {
                        Log.Write("欄位驗證錯誤", err_Item.PropertyName, err_Item.ErrorMessage);
                    }
                }

                throw ex;
            }
            catch (DbUpdateException ex)
            {
                Log.Write("DbUpdateException", ex.InnerException.Message);
                throw ex;
            }
            catch (EntityException ex)
            {
                Log.Write("EntityException", ex.Message);
                throw ex;
            }
            catch (UpdateException ex)
            {
                Log.Write("UpdateException", ex.Message);
                throw ex;
            }
            catch (Exception ex)
            {
                Log.Write("Exception", ex.Message);
                throw ex;
            }
        }

    }

}
