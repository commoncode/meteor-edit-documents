

editDocsCursor = EditDocuments.find({});

editDocsCursor.observeChanges({
  changed: function (id, fields) {
    console.log(id)
    console.log(fields)

    var diffs = {};
    var editDoc = EditDocuments.findOne({_id: id});
    var editDiff = EditDiffs.findOne({editDocId: editDoc._id});

    if(editDiff!==undefined){
      diffs = editDiff.diffs;
    }

    _.each(_.keys(fields), function (element, index, list) {
      console.log('element: ' + element)
      console.log('index: ' + index)
      console.log('list: ' + list)
      console.log('editDoc.origObj[element]: ' + editDoc.origObj[element])
      var diff = JsDiff.diffWords(editDoc.origObj[element], fields[element])
      console.log(diff)
      diffs[element] = diff;
    })

    EditDiffs.upsert(
      {
        editDocId: editDoc._id
      },
      {
        $set: {
          diffs: diffs
        }
      }
    )
  }
})


Meteor.methods({
  getOrCreateEditDoc: function (obj) {

    var editDoc = EditDocuments.findOne({
      docType: obj.type,
      docId: obj._id
    });

    var editDocs = EditDocuments.find({
      docType: obj.type,
      docId: obj._id
    });

    if(editDoc===undefined){

      var editObj = _.omit(_.pick(obj, _.keys(obj)), ['_id']);

      // used to create diffs and compare the original field keys
      // this would need to be reset once a Document is regenerated
      // from the Command side.
      editObj.origObj = _.omit(_.pick(obj, _.keys(obj)), ['_id', 'type']);
      // start with an empty object for holding the diff parts
      editObj.diffs = {};

      editObj.docType = obj.type;
      editObj.docId = obj._id;
      editObj.state = 'ready';
      editObj.action = 'read';

      var editDoc = EditDocuments.insert(
        editObj
      );

    };

    if(editDoc && editDocs.count() > 1) {
      // Somehow we have duplicates.  Remove the others.
      // Hopefully we never end up here.
      dupDocs = EditDocuments.find({
        // _id: {$not: editDoc._id}, // this isn't valid?
        docId: editDoc.docId,
        docType: editDoc.docType
      }).fetch()

      // Ideally we'd use $not to do something like:
      // EditDocuments.remove({_id: {$not: editDoc._id}, ... })
      // However that seems to be invalid here.
      //
      // Instead, we loop through an remove duplicates
      // individually.
      for (var i = dupDocs.length - 1; i >= 0; i--) {
        if(editDoc._id !== dupDocs[i]._id){
          EditDocuments.remove({_id: dupDocs[i]._id});
        }
      };
    };

    return editDoc;
  }
})
