import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class VideoService {
  constructor(private httpClient: HttpClient) { }
  

  uploadVideo(file: File):Observable<any> {
      const formData = new FormData();
      formData.append("file", file, file.name);

      const headers = new HttpHeaders({
        "security-token": "mytoken",
      });

    return this.httpClient
      .post("http://localhost:8080/api/videos", formData, {
        headers: headers,
        responseType: "blob",
      });
	}
}
