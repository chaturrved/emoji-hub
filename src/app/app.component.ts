import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver, LayoutModule, BreakpointState } from '@angular/cdk/layout';
import { merge, Observable, Subject } from 'rxjs';
import { Layout } from './interfaces/layout'
import { LayoutItem } from './interfaces/layout-item';
import { EmojiService } from './emoji.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'emoji-hub';
  logoemoticon = '&#128526;';
  emojiLayout!: Observable<Layout>;
  fetchedList!: LayoutItem[];
  filteredLayoutItems!: LayoutItem[];
  searchForm : FormGroup = new FormGroup({});
  emojis$: Observable<LayoutItem[]> = new Observable();
  pagedList: LayoutItem[]= [];
  pageIndex: number = 0;
  length: number = 0;
  pageSize: number = 10;

  constructor(private breakpointObserver: BreakpointObserver, private emojiService: EmojiService, private fb: FormBuilder) {
    if(this.pagedList == null || this.pagedList.length==0){
      this.fetchEmojis();
    }
    this.getDeviceEmojiLayout();
  }

  private fetchEmojis(): void{
    this.emojis$ = this.emojiService.getEmojis();
    this.emojis$.subscribe((e:any)=>{
      if(e){
        this.fetchedList = e;
        this.filteredLayoutItems = this.filterEmojis(this.fetchedList, '');
        this.pagedList = this.filteredLayoutItems.slice(0, 10);
        this.length = this.filteredLayoutItems.length;
        this.getDeviceEmojiLayout();
      }
    })
  }
  
  filterEmojis(list:LayoutItem[], category:string){
    if(category != ''){
      let filtered : LayoutItem[] = [];
      for(let emoji of list){
        if(emoji.category === category){
          filtered.push(emoji);
        }
      }
      return filtered;
    }else{
      return list;
    }
  }

  OnPageChange(event: any){
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.length){
      endIndex = this.length;
    }
    this.pagedList = this.filteredLayoutItems.slice(startIndex, endIndex);
    this.getDeviceEmojiLayout();
  }

  ngOnInit(): void {
    
    this.searchForm = this.fb.group({
      category: []
    })

    if(this.pagedList == null || this.pagedList.length==0){
      this.fetchEmojis();
    }

    this.searchForm.valueChanges.subscribe((value:any)=>{
      this.filteredLayoutItems = this.filterEmojis(this.fetchedList, value.category);
      this.pagedList = this.filteredLayoutItems.slice(0, 10);
      this.length = this.filteredLayoutItems.length;
      this.getDeviceEmojiLayout();
    })
  }

  getDeviceEmojiLayout(){
    this.emojiLayout = merge(
      this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.XSmall, Breakpoints.Small]).pipe(
        map(({ matches }) => {
          if (matches) {
            console.debug('👉🏽 handset layout activated',);
            return this.getHandsetLayout();
          }
          return this.getDefaultLayout();
        })),
      this.breakpointObserver.observe(Breakpoints.Tablet).pipe(
        map(({ matches }) => {
          if (matches) {
            console.debug('👉🏽  tablet layout activated', this.emojiLayout);
            return this.getTabletLayout();
          }
          return this.getDefaultLayout();
        })),
      this.breakpointObserver.observe(Breakpoints.Web).pipe(
        map(({ matches }) => {
          if (matches) {
            console.debug('👉🏽  web layout activated', this.emojiLayout);
            return this.getWebLayout();
          }
          return this.getDefaultLayout();
        }))
    );
  }

  getHandsetLayout(): Layout {
    return {
      name: 'Handset',
      gridColumns: 1,
      cols:1,
      rows:1,
      layoutItem: this.pagedList
    };
  }

  getTabletLayout(): Layout {
    return {
      name: 'Tablet',
      gridColumns: 4,
      cols:2,
      rows:1,
      layoutItem: this.pagedList
    };
  }

  getWebLayout(): Layout {
    return {
      name: 'Web',
      gridColumns: 6,
      cols:2,
      rows:1,
      layoutItem: this.pagedList
    };
  }

  getDefaultLayout(): Layout{
    return {
      name: 'default',
      gridColumns: 1,
      cols:1,
      rows:1,
      layoutItem: this.pagedList
    };
  }

  getModifiedHtmlCode(htmlCodes: string[]):string{
    let result= ''
    for(let code of htmlCodes){
      result = result + code;
    }
    return result;
  }
}
