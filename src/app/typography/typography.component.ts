import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss']
})
export class TypographyComponent {
  editorOptions = {
    theme: 'vs-dark',
    codeLens: false,
    readOnly: true,
    language: 'html',
    lineNumbers: 'off',
    minimap: { enabled: false }
  };

  codeUnorderedList = `
<ul>
  <li>
    Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id pretium metus rutrum
    sed.
  </li>
  <li>
    Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur
    ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed condimentum nisl,
    bibendum cursus felis.
  </li>
</ul>`;
}
