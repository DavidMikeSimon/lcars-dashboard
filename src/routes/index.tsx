import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import inlineStyle from "../stylus/index.styl?inline";

export default component$(() => {
  return (
    <div class="lcars-app-container">
      <div id="header" class="lcars-row header">
        <div class="lcars-elbow left-bottom lcars-tan-bg" />
        <div class="lcars-bar horizontal">
          <div class="lcars-title right">SINCLAIR</div>
        </div>
        <div class="lcars-bar horizontal right-end decorated" />
      </div>
      <div id="left-menu" class="lcars-column start-space lcars-u-1">
        <div class="lcars-bar lcars-u-1" />
      </div>
      <div id="footer" class="lcars-row">
        <div class="lcars-elbow left-top lcars-tan-bg" />
        <div class="lcars-bar horizontal both-divider bottom" />
        <div class="lcars-bar horizontal right-end left-divider bottom" />
      </div>
      <div id="inner-container">
        <div class="lcars-column lcars-u-3">
          <p>
            Can't wait to see what you build with qwik!
            <br />
            Happy coding.
          </p>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sinclair",
  styles: [
    {
      style: inlineStyle,
    },
  ],
};
