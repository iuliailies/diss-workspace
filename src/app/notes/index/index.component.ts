import {Component, OnInit} from '@angular/core';
import {PATHS} from '../../app.constants';
import {EmployeeDocument} from '../../data-types/notes.model';
import {NoteService} from "../../services/note.service";

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrl: './index.component.sass'
})
export class IndexComponent implements OnInit{
    PATHS = PATHS;
    documents: EmployeeDocument[] = []

    userId: string | null = '';

    constructor(private noteService: NoteService) {
    }

    ngOnInit() {
        this.fetchDocuments();
        this.userId = localStorage.getItem('userId');
    }

    matchesUserId(documentUserId: number): boolean {
        return documentUserId.toString() === this.userId;
    }

    fetchDocuments(): void {
        this.noteService.getDocuments().subscribe(documents => {
            this.documents = documents;
        });
    }

    deleteDocument(document: EmployeeDocument) {

    }
}
