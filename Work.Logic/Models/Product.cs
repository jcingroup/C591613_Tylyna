using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0
{
    [MetadataType(typeof(ProductMetadata))]
    public partial class Product
    {
        private class ProductMetadata
        {
            [JsonIgnore()]
            public virtual ProductKind ProductKind { get; set; }
        }
    }
}

