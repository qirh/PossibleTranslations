  <template>
    <div id="app" class="ui vertical stripe segment">
      <div class="ui container">
        <div id="content" class="ui basic segment">
          <h3 class="ui header">List of Users</h3>
          <vuetable
          api-url="http://localhost:5000/api"
          table-wrapper="#content"
          :fields="columns"
          :item-actions="itemActions"
          ></vuetable>
        </div>
      </div>
    </div>
  </template>
  <script>
  new Vue({
    el: '#app',
    data: {
      columns: [
        'word',
            'target_lang',
            'lang_1',
            'lang_2',
            'lang_3',
            'translation_1',
            'translation_2',
            'translation_3',
      ],
      itemActions: [
        { name: 'view-item', label: '', icon: 'zoom icon', class: 'ui teal button' },
        { name: 'edit-item', label: '', icon: 'edit icon', class: 'ui orange button'},
        { name: 'delete-item', label: '', icon: 'delete icon', class: 'ui red button' }
      ]
    },
    methods: {
      viewProfile: function(id) {
        console.log('view profile with id:', id)
      }
    },
    events: {
      'vuetable:action': function(action, data) {
        console.log('vuetable:action', action, data)
        if (action == 'view-item') {
          this.viewProfile(data.id)
        }
      },
      'vuetable:load-error': function(response) {
        console.log('Load Error: ', response)
      }
    }
  })
  </script>
