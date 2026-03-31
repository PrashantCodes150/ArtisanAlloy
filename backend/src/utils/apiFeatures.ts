import { Query, Document } from 'mongoose';

/**
 * API Features class for filtering, sorting, field limiting, and pagination
 */
export class APIFeatures<T extends Document> {
  public query: Query<T[], T>;
  private queryString: Record<string, any>;

  constructor(query: Query<T[], T>, queryString: Record<string, any>) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * Filter results based on query parameters
   * Supports: gte, gt, lte, lt operators
   */
  filter(): this {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering: { price: { gte: 100 } } => { price: { $gte: 100 } }
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in|nin|ne)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  /**
   * Sort results
   * Default: -createdAt (newest first)
   */
  sort(): this {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  /**
   * Limit fields in response
   */
  limitFields(): this {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  /**
   * Paginate results
   * Default: page 1, limit 10
   */
  paginate(): this {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  /**
   * Search by text (requires text index on model)
   */
  search(): this {
    if (this.queryString.search) {
      this.query = this.query.find({
        $text: { $search: this.queryString.search },
      });
    }
    return this;
  }
}

/**
 * Helper function to get pagination info
 */
export const getPaginationInfo = (
  totalDocs: number,
  page: number,
  limit: number
) => {
  const totalPages = Math.ceil(totalDocs / limit);
  return {
    currentPage: page,
    totalPages,
    totalDocs,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    limit,
  };
};
