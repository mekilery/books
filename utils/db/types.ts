/**
 * The types in this file will be used by the main db class (core.ts) in the
 * backend process and the the frontend db class (dbHandler.ts).
 *
 * DatabaseBase is an abstract class so that the function signatures
 * match on both ends i.e. DatabaseCore and DatabaseHandler.
 */

import { SchemaMap } from 'schemas/types';

type UnknownMap = Record<string, unknown>;
export abstract class DatabaseBase {
  // Create
  abstract insert(
    schemaName: string,
    fieldValueMap: UnknownMap
  ): Promise<UnknownMap>;

  // Read
  abstract get(
    schemaName: string,
    name: string,
    fields?: string | string[]
  ): Promise<UnknownMap>;

  abstract getAll(
    schemaName: string,
    options: GetAllOptions
  ): Promise<UnknownMap[]>;

  abstract getSingleValues(
    ...fieldnames: ({ fieldname: string; parent?: string } | string)[]
  ): Promise<{ fieldname: string; parent: string; value: unknown }[]>;

  // Update
  abstract rename(
    schemaName: string,
    oldName: string,
    newName: string
  ): Promise<void>;

  abstract update(schemaName: string, fieldValueMap: UnknownMap): Promise<void>;

  // Delete
  abstract delete(schemaName: string, name: string): Promise<void>;

  // Other
  abstract close(): Promise<void>;

  abstract exists(schemaName: string, name?: string): Promise<boolean>;
}

export type DatabaseMethod = keyof DatabaseBase;

export interface GetAllOptions {
  fields?: string[];
  filters?: QueryFilter;
  offset?: number;
  limit?: number;
  groupBy?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

export type QueryFilter = Record<
  string,
  boolean | string | (string | number | (string | number)[])[]
>;

/**
 * DatabaseDemuxBase is an abstract class that ensures that the function signatures
 * match between the DatabaseManager and the DatabaseDemux.
 *
 * This allows testing the frontend code while directly plugging in the DatabaseManager
 * and bypassing all the API and IPC calls.
 */
export abstract class DatabaseDemuxBase {
  abstract getSchemaMap(): Promise<SchemaMap> | SchemaMap;

  abstract createNewDatabase(
    dbPath: string,
    countryCode: string
  ): Promise<string>;

  abstract connectToDatabase(
    dbPath: string,
    countryCode?: string
  ): Promise<string>;

  abstract call(method: DatabaseMethod, ...args: unknown[]): Promise<unknown>;

  abstract callBespoke(method: string, ...args: unknown[]): Promise<unknown>;
}
