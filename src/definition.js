module.exports = {
  parseMerriamWebsterResponseJson: function (json) {
    const definitions = [];


    json.forEach(d => {
      const definition_entry = {};


      //Parse required fields.
      definition_entry["functionalLabel"] = d.fl;
      definition_entry["definitions"] = d.shortdef;
      definition_entry["headword"] = d.hwi.hw;


      //Parse optional fields.
      if ("prs" in d.hwi) {
        definition_entry["pronunciations"] = d.hwi.prs;
      }


      //Finally add the word into the definitions array.
      definitions.push(definition_entry);
    });


    return definitions;
  },
};