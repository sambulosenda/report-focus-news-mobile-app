import { format } from 'date-fns';

export const formatArticleDate = (date: string): string => {
  if (!date) return '';
  return format(new Date(date), 'MMM d');
};

export const formatArticleDateFull = (date: string): string => {
  if (!date) return '';
  return format(new Date(date), 'MMM d, yyyy');
};
