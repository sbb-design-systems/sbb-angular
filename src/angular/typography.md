# Typography

## Global Settings

SBB Angular library sets basic global typography, display and link styles.

- Use the custom SBB Font stack. `SBBWeb Roman`, `SBBWeb Bold`, `SBBWeb Light`, `SBBWeb Thin` and `SBBWeb Ultralight`
- The html base font is a `SBBWeb Roman` size `93.75% | 15px` with a line height of `1.7`
- Default body background color is `#FFFFFF`

## Headings

HTML headings, from `h1` to `h4`.

You can also use the headings classes to make every tag looks like a heading. Available classes: `.sbb-headline1`, `.sbb-headline2`, `.sbb-headline3`, `.sbb-headline4`.

<h1>h1. SBB heading</h1>
<h2>h2. SBB heading</h2>
<h3>h3. SBB heading</h3>
<h4>h4. SBB heading</h4>

```html
<h1>h1. SBB heading</h1>
<h2>h2. SBB heading</h2>
<h3>h3. SBB heading</h3>
<h4>h4. SBB heading</h4>
```

## Lead Text

<p class="sbb-text-lead">
  Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id pretium
  metus rutrum sed. Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique
  eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac,
  commodo arcu.
</p>

```html
<p class="sbb-text-lead">
  Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id pretium
  metus rutrum sed. Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique
  eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac,
  commodo arcu.
</p>
```

## Lists

### Unordered Lists

- Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id pretium metus rutrum sed.
- Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
- Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed condimentum nisl, bibendum cursus felis.

```html
<ul>
  <li>
    Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id
    pretium metus rutrum sed.
  </li>
  <li>
    Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
    vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
  </li>
</ul>
```

### Nested Unordered Lists

- Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id pretium metus rutrum sed.
  - Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
    - Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec.
  - Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
  - Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
    - Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec.
    - Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec.
    - Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec.
  - Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
- Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed condimentum nisl, bibendum cursus felis.

```html
<ul>
  <li>
    Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id
    pretium metus rutrum sed.
    <ul>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
        <ul>
          <li>
            Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend
            augue, vitae consectetur ipsum porta nec.
          </li>
        </ul>
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
        <ul>
          <li>
            Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend
            augue, vitae consectetur ipsum porta nec.
          </li>
          <li>
            Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend
            augue, vitae consectetur ipsum porta nec.
          </li>
          <li>
            Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend
            augue, vitae consectetur ipsum porta nec.
          </li>
        </ul>
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
    </ul>
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
  </li>
</ul>
```

### Ordered Lists

1.1. Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id pretium metus rutrum sed.
1.2. Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
1.3. Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed condimentum nisl, bibendum cursus felis.

```html
<ol>
  <li>
    Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id
    pretium metus rutrum sed.
  </li>
  <li>
    Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
    vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
  </li>
</ol>
```

### Nested Ordered Lists

1.1. Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id pretium metus rutrum sed.
1.1.1. Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
1.1.1.1. Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec.
1.1.2. Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
1.2. Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed condimentum nisl, bibendum cursus felis.

```html
<ol>
  <li>
    Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id
    pretium metus rutrum sed.
    <ol>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
        <ol>
          <li>
            Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend
            augue, vitae consectetur ipsum porta nec.
          </li>
        </ol>
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
    </ol>
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
  </li>
</ol>
```

### Mixed Lists

1.1. Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed condimentum nisl, bibendum cursus felis.:

- Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
- Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
  1.2. Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed condimentum nisl, bibendum cursus felis.:
- Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
- Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.

- Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed condimentum nisl, bibendum cursus felis.:
  1. Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
  2. Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
- Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed condimentum nisl, bibendum cursus felis.:
  1. Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
  2. Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.

```html
<ol>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
    <ul>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
    </ul>
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
    <ul>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
    </ul>
  </li>
</ol>
<ul>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
    <ol>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
    </ol>
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
    <ol>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
    </ol>
  </li>
</ul>
```

## Tables

In order to see sbb table styling you have to use the class `sbb-table` or call the `@include table()` mixin into your custom table selector.

Don't forget to follow a couple of simple rules for the accessibility and styling. In order to have proper styles you must use the `thead` and `tbody` tags.

In order to have proper accessibility you have to mark table headings with the proper `th` tag and the `scope` attribute set to `col` for column headers and `row` for row headers.

If you have a custom caption or legend, don't forget to use proper aria-describedby and aria-labelledby association.

<table class="sbb-table">
  <thead>
    <tr>
      <th scope="col">Company and country *1</th>
      <th scope="col">Passenger-kilometers (Mio. Pkm)</th>
      <th scope="col">Tonne-kilometers (Mio. Ntkm)</th>
      <th scope="col">Route-kilometers (Mio. Trkm)</th>
      <th scope="col">Staff (FTE)</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th scope="row">
        Long text in a link to see how it wraps in the cell. *1
      </th>
      <td>6 907</td>
      <td>
        Long text in a link to see how it wraps in the cell.
      </td>
      <td>Long text in a link to see how exactly the cell wraps</td>
      <td>24 882</td>
    </tr>
    <tr>
      <th scope="row">
        SZDC (CZ) *2
      </th>
      <td>-</td>
      <td>-</td>
      <td>161</td>
      <td>17 380</td>
    </tr>
    <tr>
      <th scope="row">
        DB AG (DE) *3
      </th>
      <td>80 805</td>
      <td>78 542</td>
      <td>1 037</td>
      <td>286 237</td>
    </tr>
    <tr>
      <th scope="row">
        FS (IT) *3
      </th>
      <td>37 489</td>
      <td>22 081</td>
      <td>316</td>
      <td>72 341</td>
    </tr>
    <tr>
      <th scope="row">
        JR (JP) *3
      </th>
      <td>244 591</td>
      <td>20 255</td>
      <td>693</td>
      <td>127 989</td>
    </tr>
    <tr>
      <th scope="row">
        NS (NL) *1
      </th>
      <td>16 604</td>
      <td>-</td>
      <td>-</td>
      <td>7 959</td>
    </tr>
  </tbody>
</table>

```html
<table class="sbb-table">
  <thead>
    <tr>
      <th scope="col">Company and country *1</th>
      <th scope="col">Passenger-kilometers (Mio. Pkm)</th>
      <th scope="col">Tonne-kilometers (Mio. Ntkm)</th>
      <th scope="col">Route-kilometers (Mio. Trkm)</th>
      <th scope="col">Staff (FTE)</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th scope="row">Long text in a link to see how it wraps in the cell. *1</th>
      <td>6 907</td>
      <td>Long text in a link to see how it wraps in the cell.</td>
      <td>Long text in a link to see how exactly the cell wraps</td>
      <td>24 882</td>
    </tr>
    <tr>
      <th scope="row">SZDC (CZ) *2</th>
      <td>-</td>
      <td>-</td>
      <td>161</td>
      <td>17 380</td>
    </tr>
    <tr>
      <th scope="row">DB AG (DE) *3</th>
      <td>80 805</td>
      <td>78 542</td>
      <td>1 037</td>
      <td>286 237</td>
    </tr>
    <tr>
      <th scope="row">FS (IT) *3</th>
      <td>37 489</td>
      <td>22 081</td>
      <td>316</td>
      <td>72 341</td>
    </tr>
    <tr>
      <th scope="row">JR (JP) *3</th>
      <td>244 591</td>
      <td>20 255</td>
      <td>693</td>
      <td>127 989</td>
    </tr>
    <tr>
      <th scope="row">NS (NL) *1</th>
      <td>16 604</td>
      <td>-</td>
      <td>-</td>
      <td>7 959</td>
    </tr>
  </tbody>
</table>
```

## Section (Fieldset)

<form>
  <fieldset>
    <legend>Journey Section 1</legend>
    Some content in here...
    <fieldset>
      <legend>Journey Section 1.1</legend>
      Some content in here...
    </fieldset>
    <fieldset>
      <legend>Journey Section 1.2</legend>
      Some content in here...
    </fieldset>
    <fieldset>
      <legend>Journey Section 1.3</legend>
      Some content in here...
    </fieldset>
  </fieldset>
  <fieldset>
    <legend>Journey Section 2</legend>
    Some content in here...
    <fieldset>
      <legend>Journey Section 2.1</legend>
      Some content in here...
    </fieldset>
    <fieldset>
      <legend>Journey Section 2.2</legend>
      Some content in here...
    </fieldset>
    <fieldset>
      <legend>Journey Section 2.3</legend>
      Some content in here...
    </fieldset>
  </fieldset>
</form>

```html
<form>
  <fieldset>
    <legend>Journey Section 1</legend>
    Some content in here...
    <fieldset>
      <legend>Journey Section 1.1</legend>
      Some content in here...
    </fieldset>
    <fieldset>
      <legend>Journey Section 1.2</legend>
      Some content in here...
    </fieldset>
    <fieldset>
      <legend>Journey Section 1.3</legend>
      Some content in here...
    </fieldset>
  </fieldset>
  <fieldset>
    <legend>Journey Section 2</legend>
    Some content in here...
    <fieldset>
      <legend>Journey Section 2.1</legend>
      Some content in here...
    </fieldset>
    <fieldset>
      <legend>Journey Section 2.2</legend>
      Some content in here...
    </fieldset>
    <fieldset>
      <legend>Journey Section 2.3</legend>
      Some content in here...
    </fieldset>
  </fieldset>
</form>
```
