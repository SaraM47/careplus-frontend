import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// Convert value to positive integer or return fallback
function toInt(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

// Sync a query ref with URL query parameters
export function useQuerySync(queryRef, defaults) {
  const route = useRoute();
  const router = useRouter();

  // Read state from URL on init
  const fromUrl = { ...defaults };
  Object.entries(route.query).forEach(([k, v]) => {
    const value = Array.isArray(v) ? v[0] : v;

    if (k === "page" || k === "pageSize") {
      fromUrl[k] = toInt(value, defaults[k]);
    } else {
      fromUrl[k] = value ?? defaults[k];
    }
  });

  queryRef.value = { ...queryRef.value, ...fromUrl };

  // Write state to URL when query changes
  watch(
    queryRef,
    (q) => {
      const nextQuery = {};
      Object.entries(q).forEach(([k, v]) => {
        const dv = defaults[k];
        if (v === "" || v === null || v === undefined) return;
        if (String(v) === String(dv)) return;
        nextQuery[k] = v;
      });

      router.replace({ query: nextQuery });
    },
    { deep: true },
  );
}
