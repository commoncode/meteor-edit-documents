Products = new Meteor.Collection('economica__products')

EditDocuments = new Meteor.Collection('edit_documents')
EditDiffs = new Meteor.Collection('edit_diffs')

// http://www.youtube.com/watch?v=uDzME15UxVM
// https://github.com/codeparty/racer
// https://josephg.com/blog/sharejs
// https://github.com/share/ShareJS
// https://github.com/commoncode/mirenesse-meteor/blob/master/client/admin.js

states = ['ready', 'committed', 'error', 'acknowledged', 'saved', 'reported']
actions = ['create', 'read', 'update', 'delete', 'duplicate']



EditDocuments.helpers({
  editDiffs: function () {
    return EditDiffs.findOne({
      editDocId: this._id
    })
  }
})

collectionHelpers = { // relies on David Burles' Collection Helpers.
  editDoc: function() {
    // Return the EditDocument

    Meteor.call('getOrCreateEditDoc', this, function (error, result) {

    });
    return EditDocuments.findOne({
      docId: this._id,
      docType: this.type
    });

  },
  upsertEditDoc: function(options) {
    // Pass in changes to the Edit Document
    console.log('upsertEditDoc');
    if(this.editDocIsReady()){
      console.log('edit document is ready, upserting...');
      EditDocuments.upsert(
        {
          docId: this._id,
          docType: this.type
        },
        options
      )
    } else {
      console.log('edit document is not ready');
      // raise some kind of message / error
    }
  },
  commitEditDoc: function () {
    // Set the Edit Document status to 'committed' and
    // allow no more changes until the status is changed
    // back to 'ready'
    EditDocument.update({
      docId: this._id,
      docType: this.type,
      state: 'committed'
    });
  },
  editDocIsReady: function () {
    // Return true if the Edit Document is ready for
    // collaboritive edits
    return this.editDoc.state === 'ready';
  }
}

Products.helpers(
  _.extend({}, collectionHelpers)
);