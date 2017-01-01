tabular
=======

Populate tables with data from the server using JavaScript; includes sorting, and pagination.


### Usage

#### From source

Clone the git repo.

Install dependencies with node:

```shell
npm install
```

Run the default *Grunt* tasks:

```shell
grunt
```

Use the `tabular.js` or `tabular.min.js` in the `build` folder.

#### From built files

Download the `tabular.js` or `tabular.min.js` in the [build](build) folder.

#### CSS

Tabular provides a minimal layout of the table, trying to be as flexible as possible, without specific styles in mind. Most of the HTML elements generated have CSS classes in them, so that you may add your own styles, or using styles provided by CSS frameworks like Bootstrap or Foundation.

Tabular comes with a minimal `tabular.css` you may download from the [css](css) folder.

#### Start tabular

Start tabular by passing options:

```javascript
tabular.start('#tabular', {
  columns: [
    { title: 'Id',          name: 'id' },
    { title: 'Title',       name: 'title' },
    { title: 'First name',  name: 'first_name' },
    { title: '',            name: 'edit_link', sort: false }
  ],
  source: '/users.json',
  plugins: [
    'Model',
    'Sort',
    'Loader',
    {
      Search: {
        formClass:  'form-horizontal col-md-3 pull-xs-right',
        inputClass: 'form-control form-control-sm'
      }
    },
    {
      Pagination: {
        containerClass: 'col-md-6',
        buttonClass:    'btn btn-sm btn-secondary'
      }
    }
  ],
  tableClass:  'table table-striped m-t-2',
  headerClass: 'row'
});
```




### Plugins

Tabular comes with several plugins:

#### `Model`

A simple `jQuery Ajax` wrapper used to fetch data from the server

#### `Pagination`

It adds pagination, passing the page number and size on each request. Accepts the following options:

- `pageSizes`:      `Array` of integers, if not provided it defaults to `[10, 25, 50]`
- `containerClass`: `String` to be applied to the paginator container
- `selectClass`:    `String` to be added to the select elements
- `buttonClass`:    `String` to be added to the button elements

#### `Sort`

It turns table headings into links for sorting. Sort makes use of the `sort` flag on `columns` option to decide which column to apply sorting to.

#### `Search`

It uses a search form to send the term to the server. Accepts the following options:

- `formClass`: `String` to be applied to the search form
- `inputClass`: `String` to be applied to the search box

#### `Loader`

A simple loader showing and hiding before and after each server request respectively


### Test

With npm:

```shell
npm test
```

With grunt:

```shell
grunt mocha
```

### Licence MIT
[Licence](LICENCE)
