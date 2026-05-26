package com.fileintegrity.backend.service;

import com.fileintegrity.backend.model.FileRecord;
import com.fileintegrity.backend.model.VerificationResponse;
import com.fileintegrity.backend.repository.FileRecordRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.security.MessageDigest;
import java.util.List;
import java.util.Optional;

@Service
public class FileService {

    @Autowired
    private FileRecordRepository fileRecordRepository;

    // SAVE FILE

    public FileRecord saveFile(
            MultipartFile file)
            throws Exception {

        String hash = generateHash(file);

        FileRecord fileRecord = new FileRecord();

        fileRecord.setFileName(
                file.getOriginalFilename());

        fileRecord.setFileSize(
                file.getSize());

        fileRecord.setFileHash(hash);

        // ONLY ONE SAVE
        return fileRecordRepository
                .save(fileRecord);
    }

    // GET ALL FILES

    public List<FileRecord> getAllFiles() {

        return fileRecordRepository.findAll();
    }

    // VERIFY FILE

    public VerificationResponse verifyFile(
            Long id,
            MultipartFile file)
            throws Exception {

        Optional<FileRecord> optionalFile = fileRecordRepository
                .findById(id);

        if (optionalFile.isEmpty()) {

            return new VerificationResponse(
                    "File not found",
                    false);
        }

        FileRecord storedFile = optionalFile.get();

        String currentHash = generateHash(file);

        boolean isValid = storedFile.getFileHash()
                .equals(currentHash);

        return new VerificationResponse(
                storedFile.getFileName(),
                isValid);
    }

    // GENERATE SHA-256

    private String generateHash(
            MultipartFile file)
            throws Exception {

        MessageDigest digest = MessageDigest
                .getInstance("SHA-256");

        byte[] hashBytes = digest.digest(
                file.getBytes());

        StringBuilder sb = new StringBuilder();

        for (byte b : hashBytes) {

            sb.append(
                    String.format(
                            "%02x",
                            b));
        }

        return sb.toString();
    }
}