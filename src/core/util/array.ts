import flow from "lodash/fp/flow";
import identity from "lodash/fp/identity";
import sortBy from "lodash/fp/sortBy";
import uniq from "lodash/fp/uniq";

export const uniqueOrderedStrings = flow<[string[]], string[], string[]>(uniq, sortBy(identity));
