// sort by date
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const sortByDate = (array: any[]) => {
  const sortedArray = array.sort(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (a:any, b:any) =>
      new Date(b.data.date && b.data.date) -
      new Date(a.data.date && a.data.date) 
  );
  return sortedArray;
};

// sort product by weight
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const sortByWeight = (array: any[]) => {
  const withWeight = array.filter(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (item: { data: { weight: any } }) => item.data.weight
  );
  const withoutWeight = array.filter(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (item: { data: { weight: any } }) => !item.data.weight
  );
  const sortedWeightedArray = withWeight.sort(
    (a: { data: { weight: number } }, b: { data: { weight: number } }) =>
      a.data.weight - b.data.weight
  );
  const sortedArray = [...new Set([...sortedWeightedArray, ...withoutWeight])];
  return sortedArray;
};
