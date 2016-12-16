using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0
{
    [MetadataType(typeof(Editor_L1Metadata))]
    public partial class Editor_L1
    {
        private class Editor_L1Metadata
        {
            [JsonIgnore()]
            public virtual ICollection<Editor_L2> Editor_L2 { get; set; }
        }
    }
}

