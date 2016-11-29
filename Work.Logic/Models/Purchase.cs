using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0
{
    [MetadataType(typeof(PurchaseMetadata))]
    public partial class Purchase
    {
        public IEnumerable<PurchaseDetail> Deatil { get; set; }
        public string customer_name { get; set; }
        public bool cancel_order { get; set; }
        public bool is_mail { get; set; }
        private class PurchaseMetadata
        {
            [JsonIgnore()]
            public virtual ICollection<PurchaseDetail> PurchaseDetail { get; set; }

            [JsonIgnore()]
            public virtual Customer Customer { get; set; }
        }
    }
}

