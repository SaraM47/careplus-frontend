// A Vue composable that provides a debounced ref based on a source ref
import { ref, watch } from "vue";

// Creates a debounced ref that updates with delay when sourceRef changes
export function useDebounce(sourceRef, delayMs = 350) {
  const debounced = ref(sourceRef.value);
  let t = null;

  // Update debounced ref with delay when sourceRef changes
  watch(sourceRef, (v) => {
    clearTimeout(t);
    t = setTimeout(() => {
      debounced.value = v;
    }, delayMs);
  });

  return debounced;
}
