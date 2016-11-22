using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0
{
    [MetadataType(typeof(ProductDetailMetadata))]
    public partial class ProductDetail
    {
        private class ProductDetailMetadata
        {
            [JsonIgnore()]
            public virtual Product Product { get; set; }
        }
    }
}

