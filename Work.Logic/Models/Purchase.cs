using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0
{
    [MetadataType(typeof(PurchaseMetadata))]
    public partial class Purchase
    {
        private class PurchaseMetadata
        {
            [JsonIgnore()]
            public virtual ICollection<PurchaseDetail> PurchaseDetail { get; set; }
        }
    }
}

