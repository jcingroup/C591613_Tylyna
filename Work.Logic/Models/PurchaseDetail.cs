using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0
{
    [MetadataType(typeof(PurchaseDetailMetadata))]
    public partial class PurchaseDetail
    {
        public string img_src { get; set; }
        private class PurchaseDetailMetadata
        {
            [JsonIgnore()]
            public virtual Product Product { get; set; }
            [JsonIgnore()]
            public virtual ProductDetail ProductDetail { get; set; }
            [JsonIgnore()]
            public virtual Purchase Purchase { get; set; }
        }
    }
}

