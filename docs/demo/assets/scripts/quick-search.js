import Awesomplete from 'awesomplete';

class QuickSearch {

    constructor() {
        this.searchField = document.getElementById('quick-search'),
        this.materialsList = document.getElementById('materials-list'),
        this.materials = this.materialsList.querySelectorAll('option');
        this.initSearch();
    }

    /**
     * Init quick search field
     */
    initSearch() {
        new Awesomplete(this.searchField);

        // Listen for change and go to URL
        this.searchField.addEventListener('awesomplete-selectcomplete', (e) => {

            let url = e.currentTarget.value;

            // Reset the value
            e.currentTarget.value = '';

            if (url) {
                window.location = window.location.origin + url;
            }
        });

        // Autofocus field when there’s no hash in the URL
        if (!window.location.hash.length) {
            this.searchField.focus();
        }
    }
}

window.QuickSearch = new QuickSearch();
