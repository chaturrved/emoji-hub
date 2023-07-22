import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { LayoutItem } from './interfaces/layout-item';

@Injectable({
  providedIn: 'root'
})
export class EmojiService {
  private url = "https://emojihub.yurace.pro/";
  private emojis$: Subject<LayoutItem[]> = new Subject();

  constructor(private httpClient: HttpClient) { }

  private refreshEmojis(){
    this.httpClient.get<LayoutItem[]>(`${this.url}api/all`)
      .subscribe(emojis=>{
        this.emojis$.next(emojis);
      });
  }

  getEmojis(): any{
    this.refreshEmojis();
    return this.emojis$;
  }
}
