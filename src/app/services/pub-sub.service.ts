import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PubSubService {

  constructor() { }

  /**
   * GET Subject by key
   * @param key 
   * @returns 
   */
  getSubject<K>(key: string): Observable<K> {
    this._validateSubject(key);
    return this.subjects.get(key)!.asObservable();
  }

  /**
   * Emit event to all subscribers
   * @param key Key subject
   * @param event Event type
   */
  emitEvent<K>(key: string, event: K) {
    this._validateSubject(key);
    this.subjects.get(key)!.next(event);
  }

  /**
   * Validate a specific key
   * and determinates if it's valid
   * @param key Key
   */
  private _validateSubject(key: string) {
    if (!this.subjects.has(key)) {
      this.subjects.set(key, new BehaviorSubject(null));
    }
  }

  private subjects: Map<string, BehaviorSubject<any>> = new Map();
}
