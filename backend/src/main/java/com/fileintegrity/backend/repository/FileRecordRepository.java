package com.fileintegrity.backend.repository;

import com.fileintegrity.backend.model.FileRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRecordRepository
        extends JpaRepository<FileRecord, Long> {
}
