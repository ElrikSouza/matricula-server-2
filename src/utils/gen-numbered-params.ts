export const genNumberedParams = (numberOfParams: number, offset = 0) => {
  const params: string[] = [];

  for (let i = 1; i <= numberOfParams; i++) {
    params.push(`$${i + offset}`);
  }

  return params.toString();
};
