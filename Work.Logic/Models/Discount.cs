using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0
{
    [MetadataType(typeof(DiscountMetadata))]
    public partial class Discount
    {
        public IEditType edit_type { get; set; }
        private class DiscountMetadata
        {
        }
    }
}

