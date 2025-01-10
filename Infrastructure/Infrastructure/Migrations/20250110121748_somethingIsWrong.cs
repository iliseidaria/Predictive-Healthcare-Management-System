using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class somethingIsWrong : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_prescriptions_medical_records_PrescriptionId",
                table: "prescriptions");

            migrationBuilder.AddColumn<Guid>(
                name: "MedicalRecordRecordId",
                table: "prescriptions",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_prescriptions_MedicalRecordRecordId",
                table: "prescriptions",
                column: "MedicalRecordRecordId");

            migrationBuilder.AddForeignKey(
                name: "FK_prescriptions_medical_records_MedicalRecordRecordId",
                table: "prescriptions",
                column: "MedicalRecordRecordId",
                principalTable: "medical_records",
                principalColumn: "RecordId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_prescriptions_medical_records_MedicalRecordRecordId",
                table: "prescriptions");

            migrationBuilder.DropIndex(
                name: "IX_prescriptions_MedicalRecordRecordId",
                table: "prescriptions");

            migrationBuilder.DropColumn(
                name: "MedicalRecordRecordId",
                table: "prescriptions");

            migrationBuilder.AddForeignKey(
                name: "FK_prescriptions_medical_records_PrescriptionId",
                table: "prescriptions",
                column: "PrescriptionId",
                principalTable: "medical_records",
                principalColumn: "RecordId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
