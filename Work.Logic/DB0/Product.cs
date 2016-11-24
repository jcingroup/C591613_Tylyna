//------------------------------------------------------------------------------
// <auto-generated>
//     這個程式碼是由範本產生。
//
//     對這個檔案進行手動變更可能導致您的應用程式產生未預期的行為。
//     如果重新產生程式碼，將會覆寫對這個檔案的手動變更。
// </auto-generated>
//------------------------------------------------------------------------------

namespace ProcCore.Business.DB0
{
    using System;
    using System.Collections.Generic;
    
    public partial class Product
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Product()
        {
            this.ProductDetail = new HashSet<ProductDetail>();
            this.PurchaseDetail = new HashSet<PurchaseDetail>();
        }
    
        public int product_id { get; set; }
        public int product_kind_id { get; set; }
        public string product_name { get; set; }
        public int stock_state { get; set; }
        public string info { get; set; }
        public string more_info { get; set; }
        public int sort { get; set; }
        public bool i_Hide { get; set; }
        public string i_InsertUserID { get; set; }
        public Nullable<int> i_InsertDeptID { get; set; }
        public Nullable<System.DateTime> i_InsertDateTime { get; set; }
        public string i_UpdateUserID { get; set; }
        public Nullable<int> i_UpdateDeptID { get; set; }
        public Nullable<System.DateTime> i_UpdateDateTime { get; set; }
        public string i_Lang { get; set; }
    
        public virtual ProductKind ProductKind { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ProductDetail> ProductDetail { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PurchaseDetail> PurchaseDetail { get; set; }
    }
}
