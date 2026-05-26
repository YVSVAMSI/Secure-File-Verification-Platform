package com.fileintegrity.backend.controller;

import com.fileintegrity.backend.model.FileRecord;
import com.fileintegrity.backend.model.VerificationResponse;
import com.fileintegrity.backend.service.FileService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class FileController {

    @Autowired
    private FileService fileService;

    // UPLOAD FILE

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadFile(
            @RequestParam("file") MultipartFile file) {

        try {

            FileRecord savedRecord = fileService.saveFile(file);

            long totalRecords = fileService.getAllFiles().size();

            Map<String, Object> response = new HashMap<>();

            response.put(
                    "id",
                    savedRecord.getId());

            response.put(
                    "fileName",
                    savedRecord.getFileName());

            response.put(
                    "fileSize",
                    savedRecord.getFileSize());

            response.put(
                    "hashValue",
                    savedRecord.getFileHash());

            response.put(
                    "totalRecords",
                    totalRecords);

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }

    // VERIFY FILE

    @PostMapping("/verify/{id}")
    public ResponseEntity<VerificationResponse> verifyFile(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        try {

            VerificationResponse response = fileService.verifyFile(id, file);

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }
}