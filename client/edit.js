
// (function($) {
//     $.fn.getCursorPosition = function() {
//         var input = this.get(0);
//         if (!input) return; // No (input) element found

//         // TODO: Change this to whitelist
//         if ($(input).is("input:checkbox")) return 0;
//         if ('selectionStart' in input) {
//             // Standard-compliant browsers
//             return input.selectionStart;
//         } else if (document.selection) {
//             // IE
//             input.focus();
//             var sel = document.selection.createRange();
//             var selLen = document.selection.createRange().text.length;
//             sel.moveStart('character', -input.value.length);
//             return sel.text.length - selLen;
//         }
//     }
// })(jQuery);

// inputListener = function (template) {
//   inputs = this.find('input')
//   _.each(inputs, function(input) {
//     $(input).getCursorPosition()
//   })
// }

// Template.editDocument.rendered = function () {
//   inputListener(this);
// }


function doGetCaretPosition (ctrl) {
  var CaretPos = 0; // IE Support
  if (document.selection) {
  ctrl.focus ();
    var Sel = document.selection.createRange ();
    Sel.moveStart ('character', -ctrl.value.length);
    CaretPos = Sel.text.length;
  }
  // Firefox support
  else if (ctrl.selectionStart || ctrl.selectionStart == '0')
    CaretPos = ctrl.selectionStart;
  return (CaretPos);
}

Template.editDocument.events({
  'keyup .edit-document-form .edit-document-form-input, keyup .edit-document-form .edit-document-form-textarea': function (event, template) {
    console.log('keyup: ' + event);

    var pos = doGetCaretPosition(event.currentTarget);
    console.log('keyup pos: ' + pos);

    var form = template.find('.edit-document-form');

    var params = {};
    params[event.currentTarget.name] = event.currentTarget.value;

    EditDocuments.update(
      {
        _id: form.dataset.id
      },
      {
        $set: params
      }
    );

  },
  'submit .edit-document-form': function (event, template) {
    console.log('submit: ' + event);
    event.preventDefault();

    var form = event.currentTarget;

    EditDocuments.update({
      _id: form.dataset.id
    }, {
      $set: { state: 'committed', action: 'update' }
    });

  }
})
