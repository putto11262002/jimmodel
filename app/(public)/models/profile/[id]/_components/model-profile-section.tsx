import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { calculateAge } from "@/lib/core/models/utils";
import type { getModel } from "@/lib/core/models/service";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Model = Awaited<ReturnType<typeof getModel>>;

interface ModelProfileSectionProps {
  model: Model;
  variant: "compact" | "full";
  className?: string;
}

function getStatusBadge(local: boolean, inTown: boolean) {
  if (local && inTown) {
    return (
      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
        Local & In Town
      </Badge>
    );
  }
  if (local) {
    return (
      <Badge
        variant="secondary"
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Local
      </Badge>
    );
  }
  if (inTown) {
    return (
      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
        In Town
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-muted-foreground">
      Out of Town
    </Badge>
  );
}

function getDisplayImage(model: Model) {
  return (
    model.profileImageURL ||
    model.images.find((img) => img.order === 0)?.url ||
    model.images[0]?.url
  );
}

function ProfileImage({
  imageUrl,
  altText,
  variant,
}: {
  imageUrl?: string;
  altText: string;
  variant: "compact" | "full";
}) {
  const containerClasses =
    variant === "compact"
      ? "relative aspect-[3/4] md:aspect-[4/5] rounded-lg overflow-hidden bg-muted max-h-[400px] md:max-h-[480px]"
      : "relative aspect-[3/4] rounded-lg overflow-hidden bg-muted";

  const sizes =
    variant === "compact"
      ? "(max-width: 768px) 100vw, (max-width: 1024px) 300px, 380px"
      : "(max-width: 1024px) 100vw, 50vw";

  return (
    <div className={containerClasses}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={altText}
          fill
          className="object-cover"
          priority
          sizes={sizes}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-20 h-20 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

function StatItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-0.5 md:space-y-1">
      <p className="text-xs md:text-sm text-muted-foreground">{label}</p>
      <p className="text-sm md:text-base lg:text-lg font-semibold text-foreground">
        {value || (
          <span className="text-muted-foreground/50 font-normal">—</span>
        )}
      </p>
    </div>
  );
}

function StatsGrid({ model, age }: { model: Model; age: number | null }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 p-4 md:p-6 rounded-lg border bg-card">
      <StatItem label="Age" value={age !== null ? `${age} years` : null} />
      <StatItem
        label="Height"
        value={model.height ? `${model.height} cm` : null}
      />
      <StatItem
        label="Weight"
        value={model.weight ? `${model.weight} kg` : null}
      />
      <StatItem label="Hips" value={model.hips ? `${model.hips} cm` : null} />
      <StatItem
        label="Hair Color"
        value={
          model.hairColor ? (
            <span className="capitalize">{model.hairColor}</span>
          ) : null
        }
      />
      <StatItem
        label="Eye Color"
        value={
          model.eyeColor ? (
            <span className="capitalize">{model.eyeColor}</span>
          ) : null
        }
      />
      <StatItem label="Nationality" value={model.nationality} />
      <StatItem label="Ethnicity" value={model.ethnicity} />
    </div>
  );
}

function TalentsSection({ talents }: { talents: string[] }) {
  if (!talents || talents.length === 0) return null;

  return (
    <div>
      <h2 className="text-sm md:text-base lg:text-lg font-semibold text-foreground mb-2 md:mb-3">
        Talents
      </h2>
      <div className="flex flex-wrap gap-1.5 md:gap-2">
        {talents.map((talent, index) => (
          <Badge key={index} variant="secondary" className="text-xs md:text-sm">
            {talent}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function ExperiencesSection({ experiences }: { experiences: string[] }) {
  if (!experiences || experiences.length === 0) return null;

  return (
    <div>
      <h2 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">
        Experience
      </h2>
      <ul className="space-y-1.5 md:space-y-2 p-4 md:p-5 rounded-lg border bg-card">
        {experiences.map((experience, index) => (
          <li
            key={index}
            className="text-sm md:text-base text-muted-foreground flex items-start"
          >
            <span className="mr-2 mt-1.5 md:mt-2 h-1.5 w-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
            <span>{experience}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ModelProfileSection({
  model,
  variant,
  className,
}: ModelProfileSectionProps) {
  const age = model.dateOfBirth ? calculateAge(model.dateOfBirth) : null;
  const displayImage = getDisplayImage(model);
  const categoryDisplay =
    model.category.charAt(0).toUpperCase() + model.category.slice(1);

  if (variant === "compact") {
    return (
      <div className={className}>
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem key="home">
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator key="sep-1" />
            <BreadcrumbItem key="models">
              <BreadcrumbLink href="/models">Models</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator key="sep-2" />
            <BreadcrumbItem key="category">
              <BreadcrumbLink href={`/models/${model.category}/1`}>
                {categoryDisplay}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator key="sep-3" />
            <BreadcrumbItem key="model">
              <BreadcrumbPage>{model.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Compact Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[380px_1fr] gap-6 md:gap-8">
          {/* Profile Image */}
          <ProfileImage
            imageUrl={displayImage}
            altText={model.name}
            variant="compact"
          />

          {/* Details Column */}
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1">
                  {model.name}
                </h1>
                {model.nickName && (
                  <p className="text-base md:text-lg text-muted-foreground">
                    &quot;{model.nickName}&quot;
                  </p>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                {getStatusBadge(model.local, model.inTown)}
              </div>
            </div>

            {/* Bio */}
            {model.bio && (
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-1.5">
                  Bio
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {model.bio}
                </p>
              </div>
            )}

            {/* Talents - Compact */}
            {model.talents && model.talents.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-2">
                  Talents
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {model.talents.map((talent, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs"
                    >
                      {talent}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <StatsGrid model={model} age={age} />
          </div>
        </div>

        {/* Experiences - Below the main section */}
        {model.experiences && model.experiences.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Experience
            </h2>
            <ul className="space-y-2 p-4 md:p-5 rounded-lg border bg-card">
              {model.experiences.map((experience, index) => (
                <li
                  key={index}
                  className="text-sm text-muted-foreground flex items-start"
                >
                  <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
                  <span>{experience}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div className={className}>
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem key="home">
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator key="sep-1" />
          <BreadcrumbItem key="models">
            <BreadcrumbLink href="/models">Models</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator key="sep-2" />
          <BreadcrumbItem key="category">
            <BreadcrumbLink href={`/models/${model.category}/1`}>
              {categoryDisplay}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator key="sep-3" />
          <BreadcrumbItem key="model">
            <BreadcrumbPage>{model.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Full Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
        {/* Left Column - Image */}
        <div>
          <ProfileImage
            imageUrl={displayImage}
            altText={model.name}
            variant="full"
          />
        </div>

        {/* Right Column - Details */}
        <div className="flex flex-col gap-6 md:gap-8">
          {/* Header */}
          <div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1 md:mb-2">
                {model.name}
              </h1>
              {model.nickName && (
                <p className="text-lg md:text-xl text-muted-foreground">
                  &quot;{model.nickName}&quot;
                </p>
              )}
            </div>
            <div className="flex gap-2 mt-3 md:mt-4">
              {getStatusBadge(model.local, model.inTown)}
            </div>
          </div>

          {/* Bio */}
          {model.bio && (
            <div>
              <h2 className="text-base md:text-lg font-semibold text-foreground mb-2">
                Bio
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {model.bio}
              </p>
            </div>
          )}

          {/* Stats Grid */}
          <StatsGrid model={model} age={age} />

          {/* Talents */}
          <TalentsSection talents={model.talents || []} />

          {/* Experiences */}
          <ExperiencesSection experiences={model.experiences || []} />
        </div>
      </div>
    </div>
  );
}
