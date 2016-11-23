using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0
{
    [MetadataType(typeof(ProductMetadata))]
    public partial class Product
    {
        public IEnumerable<m_ProductDetail> Deatil { get; set; }
        private class ProductMetadata
        {
            [JsonIgnore()]
            public virtual ProductKind ProductKind { get; set; }

            [JsonIgnore()]
            public virtual ICollection<ProductDetail> ProductDetail { get; set; }
        }
    }
}

