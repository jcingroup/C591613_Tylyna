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
    
    public partial class PurchaseDetail
    {
        public int purchase_detail_id { get; set; }
        public string purchase_no { get; set; }
        public int product_id { get; set; }
        public int product_detail_id { get; set; }
        public int qty { get; set; }
        public double price { get; set; }
        public double sub_total { get; set; }
        public string p_d_sn { get; set; }
        public string p_name { get; set; }
        public string p_d_pack_name { get; set; }
    
        public virtual Product Product { get; set; }
        public virtual ProductDetail ProductDetail { get; set; }
        public virtual Purchase Purchase { get; set; }
    }
}
