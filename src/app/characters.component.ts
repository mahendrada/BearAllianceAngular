import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Character } from './character.model';
import { Film } from './film.model';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'character-list',
  templateUrl: './characters.component.html',
  styleUrls: [ './characters.component.css' ]
})
export class CharactersComponent  {
  name = 'Angular';
filmsUrls = [];
films = [];
  constructor(private http: HttpClient) { }

charcterList = new Array<Character>();

  ngOnInit(){
    this.http.get('/assets/characters.json')
    .subscribe(
      data => {          
          //this.charcterList = data.characters;
          data.characters.forEach( c => {
            this.charcterList.push({name: c.name, url: c.url, films: new Array<Film>() });
          } );

        },
        err => {
          console.log("error");
          console.log(err);
        }
    );
  }

  getMovies(name: string,url: string){
    console.log(url);

    this.http.get(url).subscribe(char =>  {
      this.filmsUrls = char.films; 

      var observables = this.filmsUrls.map(url => this.http.get(url));     
      forkJoin(observables)
      .subscribe(val => {
        console.log(val);
        //this.films = val;

        let index = this.charcterList.findIndex(item => item.name == name);
        console.log(index);
        this.charcterList[index].films = val;

        console.log(this.charcterList[index].films);
         });

      });

  }
}
