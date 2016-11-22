using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0
{
    [MetadataType(typeof(ProductKindMetadata))]
    public partial class ProductKind
    {
        private class ProductKindMetadata
        {
            [JsonIgnore()]
            public virtual ICollection<Product> Product { get; set; }
        }
    }
}

