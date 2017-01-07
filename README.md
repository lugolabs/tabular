tabular
=======

*Populate tables with data from the server using JavaScript; includes sorting, and pagination.*


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

Download the `tabular.js` or `tabular.min.js` in the [build](https://github.com/lugolabs/tabular/tree/master/build) folder.

#### CSS

Tabular provides a minimal layout of the table, trying to be as flexible as possible, without specific styles in mind. Most of the HTML elements generated have CSS classes in them, so that you may add your own styles, or using styles provided by CSS frameworks like Bootstrap or Foundation.

Tabular comes with a minimal `tabular.css` you may download from the [css](https://github.com/lugolabs/tabular/tree/master/css) folder.

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

The first argument is the selector of the table container, also called the main element. This will be used to append all the generated markup, also to listen and trigger events that the plugins use to communicate.

### Plugins

Tabular comes with several plugins:

#### `View`

It renders the markup of the table, as well as the header and footer.

It triggers the following event on the main element:

- `view:header` - after the header of the element is rendered. The default view plugins bind to this event to render their markup.
- `view:footer` - after the footer of the element is rendered.
- `view:tableHead` - after the table `thead` is rendered. A reference to the `thead` is passed to the event handler.
- `view:afterRender` - after the server response is rendered on the table, a copy of the response is passed to the event handler.

It binds to the following events:

- `model:success` - to render the new data on the table.

#### `Model`

A simple `jQuery Ajax` wrapper used to fetch data from the server. It uses events to specify when the fetching data from server starts and completes.

The model listens to the following events on the main element:

- `model:fetch` - it starts fetching data from server using GET. It sends to the server any data passed. Trigger it with an instance of the main element thus:

```javascript
element.trigger('model:fetch', [{ q: 'apple' }, true]);
```

The first element of the data passed to the event:

```js
{ q: 'apple' }
```

is the request data, whereas the second element resets the model's metadata. Unless specified, the model saves the metadata between fetches.

The model triggers the following events:

- `model:startFetch` - just before the request starts
- `model:stopFetch` - after the response is back, it sends the response unchanged to the event listener.
- `model:success` - after the response is back, it sends the response unchanged to the event listener.

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


### Testing

With npm:

```shell
npm test
```

With grunt:

```shell
grunt mocha
```

Or just run:

```sh
grunt watch
```

which watches for changes to the source files and rebuilds the build files.


### Dependencies

- `jQuery`

### Licence MIT
[Licence](https://github.com/lugolabs/tabular/blob/master/LICENCE)
