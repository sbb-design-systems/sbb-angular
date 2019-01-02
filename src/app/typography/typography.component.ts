import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';

@Component({
  selector: 'sbb-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss']
})
export class TypographyComponent {

  @ViewChildren('pageLink') pageLinks: QueryList<ElementRef>;

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

  codeNestedUnorderedList = `
<ul>
  <li>
    Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id pretium metus rutrum sed.
    <ul>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue.
          Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
        <ul>
          <li>
            Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec.
          </li>
        </ul>
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue.
          Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue.
          Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
        <ul>
          <li>
            Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec.
          </li>
          <li>
            Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec.
          </li>
          <li>
            Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec.
          </li>
        </ul>
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue.
          Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
    </ul>
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed condimentum nisl, bibendum cursus felis.
  </li>
</ul>`;

  codeOrderedList = `
<ol>
  <li>
    Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id pretium metus rutrum sed.
  </li>
  <li>
    Curabitur vitae vehicula sem. Praesent et convallis augue.
      Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed condimentum nisl, bibendum cursus felis.
  </li>
</ol>`;

  codeNestedOrderedList = `
<ol>
  <li>
    Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id pretium metus rutrum sed.
    <ol>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue.
         Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
        <ol>
          <li>
            Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec.
          </li>
        </ol>
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue.
         Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
    </ol>
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed condimentum nisl, bibendum cursus felis.
  </li>
</ol>`;

  codeMixedList = `
<ol>
  <li>Die Person mit einer Behinderung besitzt eine Begleiterkarteund einen gültigen Fahrausweis.
   Als Fahrausweis gilt (dann reist die Begleitperson gratis):
    <ul>
      <li>Curabitur vitae vehicula sem. Praesent et convallis augue.
       Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.</li>
      <li>Curabitur vitae vehicula sem. Praesent et convallis augue.
       Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.</li>
    </ul>
  </li>
  <li>Die Begleitperson besitzt einen gültigen Fahrausweis.
   Als Fahrausweis gilt (dann reist die Person mit einer Behinderung und einer Begleiterkarte gratis):
    <ul>
      <li>Curabitur vitae vehicula sem. Praesent et convallis augue.
       Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.</li>
      <li>Curabitur vitae vehicula sem. Praesent et convallis augue.
       Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.</li>
    </ul>
  </li>
</ol>
<ul>
  <li>Die Person mit einer Behinderung besitzt eine Begleiterkarteund einen gültigen Fahrausweis.
   Als Fahrausweis gilt (dann reist die Begleitperson gratis):
    <ol>
      <li>Curabitur vitae vehicula sem. Praesent et convallis augue.
       Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.</li>
      <li>Curabitur vitae vehicula sem. Praesent et convallis augue.
       Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.</li>
    </ol>
  </li>
  <li>Die Begleitperson besitzt einen gültigen Fahrausweis.
   Als Fahrausweis gilt (dann reist die Person mit einer Behinderung und einer Begleiterkarte gratis):
    <ol>
      <li>Curabitur vitae vehicula sem. Praesent et convallis augue.
       Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.</li>
      <li>Curabitur vitae vehicula sem. Praesent et convallis augue.
       Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.</li>
    </ol>
  </li>
</ul>`;


  goToInpageLink(evt: any, pageLinkIndex: number) {
    evt.preventDefault();
    this.pageLinks.toArray()[pageLinkIndex].nativeElement.focus();
  }
}
