import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <iframe class="embedded-page-iframe" src="https://sinclair.pipsimon.com" />
  );
});

export const head: DocumentHead = {
  title: "Sinclair",
};
